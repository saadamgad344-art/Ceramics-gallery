using ElKafrwy.API.Dtos;
using ElKafrwy.Infrastructure;
using ElKafrwy.Domain.Entities;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElKafrwy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly ElKafrwyDbContext _context;

        public BrandsController(ElKafrwyDbContext context)
        {
            _context = context;
        }

        //  GET ALL
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BrandDto>>> GetBrands()
        {
            var brands = await _context.Brands
                .Include(b => b.Products)
                .ToListAsync();

            var result = brands.Select(b => new BrandDto
            {
                Id = b.Id,
                Name = b.Name,
                Products = b.Products?.Select(p => new ProductSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    PricePerMeter = p.PricePerMeter
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        //  GET BY ID 
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BrandDto>> GetBrand(int id)
        {
            var b = await _context.Brands
                .Include(b => b.Products)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (b == null) return NotFound();

            var dto = new BrandDto
            {
                Id = b.Id,
                Name = b.Name,
                Products = b.Products?.Select(p => new ProductSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    PricePerMeter = p.PricePerMeter
                }).ToList()
            };

            return Ok(dto);
        }

        //   CREATE 
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BrandDto>> CreateBrand(BrandCreateDto dto)
        {
            var brand = new Brand
            {
                Name = dto.Name
            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, dto);
        }

        //  UPDATE 
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBrand(int id, BrandUpdateDto dto)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null) return NotFound();

            brand.Name = dto.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //  DELETE 
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands
                .Include(b => b.Products)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (brand == null) return NotFound();

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
