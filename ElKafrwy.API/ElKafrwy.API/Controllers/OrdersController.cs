using ElKafrwy.Domain.Entities;
using ElKafrwy.Infrastructure;
using ElKafrwy.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElKafrwy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class OrdersController : ControllerBase
    {
        private readonly ElKafrwyDbContext _context;
        public OrdersController(ElKafrwyDbContext context) => _context = context;

        
        [HttpGet]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var userName = User.Identity!.Name!;
            return await _context.Orders
                .Where(o => o.CustomerUserName == userName)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .ToListAsync();
        }

        
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Order>> CreateOrder(OrderCreateDto orders)
        {
           
           
            Order newOrder = new Order();
            newOrder.CustomerUserName = User.Identity.Name ?? "Guest";
            newOrder.OrderDate = DateTime.Now;
            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();
            List< OrderItem > items= new List<OrderItem>();
            foreach (var orderItemRequest in orders.OrderItems)
            {
                var orderItem = new OrderItem();
                orderItem.OrderId = newOrder.Id;
                orderItem.ProductId = orderItemRequest.ProductId;
                orderItem.Quantity = orderItemRequest.Quantity;
                orderItem.Price = _context.Products.Find(orderItemRequest.ProductId).PricePerMeter;
                items.Add(orderItem);

            }
            _context.OrderItems.AddRange(items);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOrders), orders);
        }
    }
}
