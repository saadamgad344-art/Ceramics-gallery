namespace ElKafrwy.API.Dtos
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public List<ProductSummaryDto>? Products { get; set; }
    }
}
