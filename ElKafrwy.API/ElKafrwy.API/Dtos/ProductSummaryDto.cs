namespace ElKafrwy.API.Dtos
{
    public class ProductSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal PricePerMeter { get; set; }
    }
}
