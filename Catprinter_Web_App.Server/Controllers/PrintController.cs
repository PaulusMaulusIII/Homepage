using System.Drawing;
using Catprinter.Utils;
using InTheHand.Net.Bluetooth;
using InTheHand.Net.Sockets;
using Microsoft.AspNetCore.Mvc;

namespace Catprinter.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrintController : ControllerBase
    {
        BluetoothClient client;
        BluetoothDeviceInfo device;

        [HttpGet("search")]
        public async Task<IActionResult> SearchBluetoothDevices()
        {
            client = new BluetoothClient();
            IReadOnlyCollection<BluetoothDeviceInfo> devices = client.DiscoverDevices();
            return Ok(devices);
        }

        [HttpPost("connect")]
        public async Task<IActionResult> ConnectToPrinter(String deviceName)
        {
            if (client == null)
            {
                NotFound("Client has not been initiated");
            }
            IReadOnlyCollection<BluetoothDeviceInfo> devices = client.DiscoverDevices().Where(
                d => d.DeviceName == deviceName
            ).ToList();

            if (!devices.Any())
            {
                return NotFound("Device not found");
            }

            device = devices.First();
            Guid printService = new Guid();
            foreach (Guid service in device.InstalledServices)
            {
                if (service.ToString().ToUpper().Equals("00001101-0000-1000-8000-00805F9B34FB"))
                {
                    printService = service;
                    break;
                }
            }
            if (!printService.ToString().ToUpper().Equals("00001101-0000-1000-8000-00805F9B34FB"))
            {
                return NotFound("No compatible Print Service found");
            }
            client.Connect(device.DeviceAddress, printService);
            return Ok("Connected To:" + device.DeviceName);
        }

        [HttpPost("print")]
        public async Task<IActionResult> PrintImage([FromBody] PrintRequest request)
        {
            if (client == null)
            {
                NotFound("Client has not been initiated");
            }
            using (Stream stream = client.GetStream())
            {
                Bitmap img;
                if (request.ImageFile != null)
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        await request.ImageFile.CopyToAsync(ms);
                        img = new Bitmap(ms);
                    }
                }
                else if (!string.IsNullOrEmpty(request.Base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(request.Base64Image);
                    using (MemoryStream ms = new MemoryStream(imageBytes))
                    {
                        img = new Bitmap(ms);
                    }

                }
                else
                {
                    return BadRequest("No image provided");
                }

                byte[] commands = PrinterCommands.GetImgPrintCmd(img, request.Energy, request.DPI);
                await stream.WriteAsync(commands, 0, commands.Length);
            }

            return Ok("Please await print");
        }
    }

    public class PrintRequest
    {
        public string Base64Image { get; set; }
        public IFormFile ImageFile { get; set; }
        public int Energy { get; set; }
        public int DPI { get; set; }
    }
}
