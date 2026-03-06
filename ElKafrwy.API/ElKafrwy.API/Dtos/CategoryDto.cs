namespace ElKafrwy.API.Dtos
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int? ParentCategoryId { get; set; }
        public List<SubCategoryDto>? SubCategories { get; set; }
    }
}