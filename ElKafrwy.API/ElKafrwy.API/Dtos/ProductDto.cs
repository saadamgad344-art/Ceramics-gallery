namespace ElKafrwy.API.Dtos
{
    public class ProductDto
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
        public string? CategoryName { get; set; }

        public int? BrandId { get; set; }
        public string? BrandName { get; set; }

        public List<ProductImageDto>? ProductImages { get; set; }
    }
}
