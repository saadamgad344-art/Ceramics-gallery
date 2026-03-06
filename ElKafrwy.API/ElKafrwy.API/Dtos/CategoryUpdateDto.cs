namespace ElKafrwy.API.Dtos
{
    public class CategoryUpdateDto
    {
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
    }
}
