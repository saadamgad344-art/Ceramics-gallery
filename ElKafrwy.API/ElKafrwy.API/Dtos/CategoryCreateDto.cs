namespace ElKafrwy.API.Dtos
{
    public class CategoryCreateDto
    {
        public string Name { get; set; } = null!;
        public int? ParentCategoryId { get; set; }
    }
}
