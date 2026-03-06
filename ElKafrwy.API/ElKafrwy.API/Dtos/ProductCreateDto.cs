namespace ElKafrwy.API.Dtos
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal PricePerMeter { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
        public string? Texture { get; set; }        
        public int? StockQuantity { get; set; }

        public int? CategoryId { get; set; }
        public int? BrandId { get; set; }

        public List<ProductImageCreateDto>? ProductImages { get; set; }
    }
}
