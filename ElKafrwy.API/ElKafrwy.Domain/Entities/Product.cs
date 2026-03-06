using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElKafrwy.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal PricePerMeter { get; set; }

        public string? Size { get; set; }

        public string? Color { get; set; }

        public string? Texture { get; set; }

        public int? StockQuantity { get; set; }

        

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public int? BrandId { get; set; }
        public Brand? Brand { get; set; }

        public ICollection<ProductImage>? ProductImages { get; set; }

        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
