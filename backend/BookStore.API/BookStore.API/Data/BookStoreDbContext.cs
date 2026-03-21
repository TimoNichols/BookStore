using Microsoft.EntityFrameworkCore;

namespace BookStore.API.Data;

public class BookStoreDbContext : DbContext
{
    public BookStoreDbContext(DbContextOptions<BookStoreDbContext> options) : base(options) { }

    public DbSet<Book> Books { get; set; }
}