namespace ElKafrwy.API.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string CustomerUserName { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }
}
