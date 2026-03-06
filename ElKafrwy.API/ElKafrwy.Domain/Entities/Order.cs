using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElKafrwy.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }

        [Required]
        public string CustomerUserName { get; set; } = null!;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }

}
