using Azure.Core;
using ElKafrwy.API.Dtos;

using ElKafrwy.Domain.Entities;
using ElKafrwy.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace ElKafrwy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ElKafrwyDbContext _context;
        private readonly IWebHostEnvironment _environment;


        public ProductsController(ElKafrwyDbContext context , IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        //  GET ALL  
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.ProductImages)
                .ToListAsync();

            var result = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PricePerMeter = p.PricePerMeter,
                Size = p.Size,
                Color = p.Color,
                Texture = p.Texture,
                StockQuantity = p.StockQuantity,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name,
                BrandId = p.BrandId,
                BrandName = p.Brand?.Name,
                ProductImages = p.ProductImages?.Select(pi => new ProductImageDto
                {
                    Id = pi.Id,
                    ImageUrl = (!pi.ImageUrl.Contains("http")) ? $"{Request.Scheme}://{Request.Host}{pi.ImageUrl}" : pi.ImageUrl
                }).ToList()
            }).ToList();

            return Ok(result);
}

//  GET BY ID 
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var p = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (p == null) return NotFound();

            var dto = new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                PricePerMeter = p.PricePerMeter,
                Size = p.Size,
                Color = p.Color,
                Texture = p.Texture,
                StockQuantity = p.StockQuantity,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name,
                BrandId = p.BrandId,
                BrandName = p.Brand?.Name,
                ProductImages = p.ProductImages?.Select(pi => new ProductImageDto
                {
                    Id = pi.Id,
                    ImageUrl = (!pi.ImageUrl.Contains("http")) ? $"{Request.Scheme}://{Request.Host}{pi.ImageUrl}" : pi.ImageUrl
                }).ToList()
            };

            return Ok(dto);
        }

        //   CREATE 
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductCreateDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                PricePerMeter = dto.PricePerMeter,
                Size = dto.Size,
                Color = dto.Color,
                Texture = dto.Texture,
                StockQuantity = dto.StockQuantity,
                CategoryId = dto.CategoryId,
                BrandId = dto.BrandId,
                ProductImages = dto.ProductImages?.Select(pi => new ProductImage
                {
                    ImageUrl = pi.ImageUrl
                }).ToList()
            };
           

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            
            var resultDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PricePerMeter = product.PricePerMeter,
                Size = product.Size,
                Color = product.Color,
                Texture = product.Texture,
                StockQuantity = product.StockQuantity,
                CategoryId = product.CategoryId,
                CategoryName = null,
                BrandId = product.BrandId,
                BrandName = null,
                ProductImages = product.ProductImages?.Select(pi => new ProductImageDto { Id = pi.Id, ImageUrl = pi.ImageUrl }).ToList()
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, resultDto);
        }

        //  UPDATE 
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, ProductUpdateDto dto)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.PricePerMeter = dto.PricePerMeter;
            product.Size = dto.Size;
            product.Color = dto.Color;
            product.Texture = dto.Texture;
            product.StockQuantity = dto.StockQuantity;
            product.CategoryId = dto.CategoryId;
            product.BrandId = dto.BrandId;

            
            if (dto.ProductImages != null)
            {
                
                _context.ProductImages.RemoveRange(product.ProductImages ?? new List<ProductImage>());

                
                product.ProductImages = dto.ProductImages.Select(pi => new ProductImage
                {
                    ImageUrl = pi.ImageUrl
                }).ToList();
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        //  UPLOAD IMAGE 
        [HttpPost("{id}/images")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductImageDto>> UploadImage(int id, IFormFile file)
        {
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();
            if (file == null || file.Length == 0) return BadRequest("file missing");

            var uploads = Path.Combine("wwwroot", "images", "products");
            Directory.CreateDirectory(uploads);
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploads, fileName);
            using var stream = System.IO.File.Create(filePath);
            await file.CopyToAsync(stream);

            var url = $"/images/products/{fileName}";
            var img = new ProductImage { ImageUrl = url };
            product.ProductImages ??= new List<ProductImage>();
            product.ProductImages.Add(img);
            await _context.SaveChangesAsync();

            var dto = new ProductImageDto { Id = img.Id, ImageUrl = img.ImageUrl };
            return Ok(dto);
        }

       

        //   DELETE  


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
           
            var product = await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.OrderItems)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

           
            if (product.OrderItems != null && product.OrderItems.Any())
            {
                _context.OrderItems.RemoveRange(product.OrderItems);
            }

            
            if (product.ProductImages != null && product.ProductImages.Any())
            {
                _context.ProductImages.RemoveRange(product.ProductImages);
            }

            
            _context.Products.Remove(product);

            
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
