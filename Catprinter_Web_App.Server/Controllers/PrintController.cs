using Microsoft.AspNetCore.Mvc;
using Catprinter.Utils;
using System.Drawing;
using InTheHand.Net;
using InTheHand.Net.Sockets;
using Microsoft.AspNetCore.SignalR;
using Catprinter.Web.Hubs;
using System.IO;

namespace Catprinter.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrintController : ControllerBase
    {
        private readonly IPrinterService _printerService;
        private readonly IHubContext<PrintHub> _hubContext;
        private static BluetoothClient _client;
        private static BluetoothDeviceInfo _printer;
        private static Stream _stream;

        public PrintController(IPrinterService printerService, IHubContext<PrintHub> hubContext)
        {
            _printerService = printerService;
            _hubContext = hubContext;
        }

        [HttpPost("connect-printer")]
        public async Task<IActionResult> ConnectToPrinter()
        {
            try
            {
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Finding Printer");
                _client = new BluetoothClient();
                IReadOnlyCollection<BluetoothDeviceInfo> devices = _client.DiscoverDevices();
                _printer = devices.FirstOrDefault(device => device.DeviceName == "X5h-0000");

                if (_printer == null)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Printer not found");
                    return NotFound("Printer not found.");
                }

                BluetoothAddress address = _printer.DeviceAddress;
                Guid spp = _printer.InstalledServices.FirstOrDefault(service => service.ToString().ToUpper().Equals("00001101-0000-1000-8000-00805F9B34FB"));

                if (spp == Guid.Empty)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveMessage", "SPP service not found");
                    return NotFound("SPP service not found.");
                }

                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Connecting to printer");
                _client.Connect(_printer.DeviceAddress, spp);
                _stream = _client.GetStream();
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Connected to printer");

                return Ok("Connected to printer successfully.");
            }
            catch (Exception ex)
            {
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", $"Internal server error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("Invalid image.");
            }

            var filePath = Path.Combine("UploadedImages", image.FileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                return Ok(new { ImagePath = filePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("print-image")]
        public async Task<IActionResult> PrintImage([FromBody] PrintImageRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ImagePath))
            {
                return BadRequest("Invalid request.");
            }

            try
            {
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Generating Image Data");
                Bitmap img = ImageProcessing.ReadImg(request.ImagePath, PrinterCommands.PRINT_WIDTH, "floyd-steinberg", true);
                img.Save("processed_image.jpg");
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Image Data Generated");

                if (_client == null || _printer == null || _stream == null)
                {
                    await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Printer not connected");
                    return BadRequest("Printer not connected.");
                }

                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Generating and sending commands");
                _stream.Write(PrinterCommands.GetImgPrintCmd(img, 0xffff));
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Commands sent");

                return Ok("Image printed successfully.");
            }
            catch (Exception ex)
            {
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", $"Internal server error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class PrintImageRequest
    {
        public string ImagePath { get; set; }
    }
}
