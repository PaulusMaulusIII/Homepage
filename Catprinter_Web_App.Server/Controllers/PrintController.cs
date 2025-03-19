using System.Drawing;
using System.Drawing.Imaging;
using Catprinter.Utils;
using InTheHand.Net.Sockets;
using Microsoft.AspNetCore.Mvc;

namespace Catprinter.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrintController : ControllerBase
    {
        [HttpPost("process")]
        [ProducesResponseType<IActionResult>(StatusCodes.Status200OK)]
        [ProducesResponseType<IActionResult>(StatusCodes.Status404NotFound)]
        [ProducesResponseType<IActionResult>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ProcessImage(IFormFile imgFile, string dithering, bool invert)
        {
            Bitmap img = null;
            Bitmap processedImg = null;

            using (MemoryStream ms = new MemoryStream())
            {
                await imgFile.CopyToAsync(ms);
                img = new Bitmap(ms);
            }
            if (img == null)
            {
                return NotFound("Failed to upload image");
            }

            processedImg = ImageProcessing.ReadImg(img, PrinterCommands.PRINT_WIDTH, dithering, invert);

            if (processedImg == null)
            {
                return BadRequest("Image could not be processed");
            }

            using (MemoryStream ms = new MemoryStream())
            {
                processedImg.Save(ms, ImageFormat.Jpeg);
                var base64Image = Convert.ToBase64String(ms.ToArray());
                return Ok(base64Image);
            }
        }

        [HttpPost("generatePrintCmd")]
        [ProducesResponseType<IActionResult>(StatusCodes.Status200OK)]
        public IActionResult GeneratePrintCmd(int energy, int dpi)
        {
            Bitmap img = new Bitmap("processed_image.jpg");

            if (img == null)
            {
                return NotFound("Failed to load image");
            }

            byte[] command = PrinterCommands.GetImgPrintCmd(img, energy, dpi);
            return Ok(Convert.ToBase64String(command));
        }
    }
}
