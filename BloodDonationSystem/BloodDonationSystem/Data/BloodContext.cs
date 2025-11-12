using Microsoft.EntityFrameworkCore;
using BloodBankSystem.Models;
using System;

namespace BloodBankSystem.Data
{
    public class BloodContext : DbContext
    {
        public BloodContext(DbContextOptions<BloodContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<DonorProfile> DonorProfiles { get; set; }
        public DbSet<RecipientProfile> RecipientProfiles { get; set; }
        public DbSet<BloodBank> BloodBanks { get; set; }
        public DbSet<BloodStock> BloodStocks { get; set; }
        public DbSet<BloodRequest> BloodRequests { get; set; }
        public DbSet<DonationRecord> DonationRecords { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<NotificationLog> NotificationLogs { get; set; }
        public DbSet<DonorRequestLink> DonorRequestLinks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===============================
            // 🔗 RELATIONSHIPS
            // ===============================

            // User ↔ DonorProfile (1–1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.DonorProfile)
                .WithOne(d => d.User)
                .HasForeignKey<DonorProfile>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User ↔ RecipientProfile (1–1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.RecipientProfile)
                .WithOne(r => r.User)
                .HasForeignKey<RecipientProfile>(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User ↔ NotificationLog (1–Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // BloodBank ↔ BloodStock (1–Many)
            modelBuilder.Entity<BloodBank>()
                .HasMany(b => b.BloodStocks)
                .WithOne(bs => bs.BloodBank)
                .HasForeignKey(bs => bs.BloodBankId)
                .OnDelete(DeleteBehavior.Cascade);

            // BloodBank ↔ DonationRecord (1–Many)
            modelBuilder.Entity<BloodBank>()
                .HasMany(b => b.DonationRecords)
                .WithOne(dr => dr.BloodBank)
                .HasForeignKey(dr => dr.BloodBankId)
                .OnDelete(DeleteBehavior.NoAction);

            // BloodBank ↔ Appointment (1–Many)
            modelBuilder.Entity<BloodBank>()
                .HasMany(b => b.Appointments)
                .WithOne(a => a.BloodBank)
                .HasForeignKey(a => a.BloodBankId)
                .OnDelete(DeleteBehavior.NoAction);

            // DonorProfile ↔ DonationRecord (1–Many)
            modelBuilder.Entity<DonorProfile>()
                .HasMany(d => d.DonationRecords)
                .WithOne(r => r.Donor)
                .HasForeignKey(r => r.DonorId)
                .OnDelete(DeleteBehavior.NoAction);

            // DonorProfile ↔ Appointment (1–Many)
            modelBuilder.Entity<DonorProfile>()
                .HasMany(d => d.Appointments)
                .WithOne(a => a.Donor)
                .HasForeignKey(a => a.DonorId)
                .OnDelete(DeleteBehavior.NoAction);

            // RecipientProfile ↔ BloodRequest (1–Many)
            modelBuilder.Entity<RecipientProfile>()
                .HasMany(r => r.BloodRequests)
                .WithOne(b => b.Recipient)
                .HasForeignKey(b => b.RecipientId)
                .OnDelete(DeleteBehavior.Cascade);

            // DonorProfile ⇄ BloodRequest (Many–Many via DonorRequestLink)
            modelBuilder.Entity<DonorRequestLink>()
                .HasOne(l => l.Donor)
                .WithMany(d => d.DonorRequestLinks)
                .HasForeignKey(l => l.DonorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<DonorRequestLink>()
                .HasOne(l => l.Request)
                .WithMany(r => r.DonorRequestLinks)
                .HasForeignKey(l => l.RequestId)
                .OnDelete(DeleteBehavior.NoAction);

            // ===============================
            // 🌱 SEED DATA
            // ===============================

            // --- Users (with all required fields) ---
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "System",
                    LastName = "Admin",
                    Username = "admin",
                    Email = "admin@gmail.com",
                    PasswordHash = "admin123",
                    Role = UserRole.Admin,
                    CreatedAt = new DateTime(2025, 01, 01)
                },
                new User
                {
                    Id = 2,
                    FirstName = "Arun",
                    LastName = "Kumar",
                    Username = "arun",
                    Email = "arun@gmail.com",
                    PasswordHash = "pass123",
                    Role = UserRole.Donor,
                    CreatedAt = new DateTime(2025, 01, 01)
                },
                new User
                {
                    Id = 3,
                    FirstName = "Suresh",
                    LastName = "Rajan",
                    Username = "suresh",
                    Email = "suresh@gmail.com",
                    PasswordHash = "pass123",
                    Role = UserRole.Donor,
                    CreatedAt = new DateTime(2025, 01, 01)
                },
                new User
                {
                    Id = 4,
                    FirstName = "Priya",
                    LastName = "Devi",
                    Username = "priya",
                    Email = "priya@gmail.com",
                    PasswordHash = "pass456",
                    Role = UserRole.Recipient,
                    CreatedAt = new DateTime(2025, 01, 01)
                },
                new User
                {
                    Id = 5,
                    FirstName = "Kavya",
                    LastName = "Raj",
                    Username = "kavya",
                    Email = "kavya@gmail.com",
                    PasswordHash = "pass456",
                    Role = UserRole.Recipient,
                    CreatedAt = new DateTime(2025, 01, 01)
                }
            );

            // --- Donor Profiles ---
            modelBuilder.Entity<DonorProfile>().HasData(
                new DonorProfile
                {
                    Id = 1,
                    UserId = 2,
                    BloodGroup = "A+",
                    Age = 28,
                    Gender = "Male",
                    LastDonationDate = new DateTime(2025, 06, 10),
                    EligibilityStatus = true
                },
                new DonorProfile
                {
                    Id = 2,
                    UserId = 3,
                    BloodGroup = "B+",
                    Age = 32,
                    Gender = "Male",
                    LastDonationDate = new DateTime(2025, 05, 20),
                    EligibilityStatus = true
                }
            );

            // --- Recipient Profiles ---
            modelBuilder.Entity<RecipientProfile>().HasData(
                new RecipientProfile
                {
                    Id = 1,
                    UserId = 4,
                    HospitalName = "Apollo Hospital",
                    PatientName = "Priya Devi",
                    RequiredBloodGroup = "A+",
                    ContactNumber = "9876543210"
                },
                new RecipientProfile
                {
                    Id = 2,
                    UserId = 5,
                    HospitalName = "Global Hospital",
                    PatientName = "Kavya Raj",
                    RequiredBloodGroup = "B+",
                    ContactNumber = "9998877665"
                }
            );

            // --- Blood Banks ---
            modelBuilder.Entity<BloodBank>().HasData(
                new BloodBank
                {
                    Id = 1,
                    Name = "Chennai Central Blood Bank",
                    Location = "Chennai",
                    ContactNumber = "9876543210",
                    Email = "che@gmail.com",
                    Capacity = 500,
                    ManagedBy = "Admin"
                },
                new BloodBank
                {
                    Id = 2,
                    Name = "Coimbatore Blood Bank",
                    Location = "Coimbatore",
                    ContactNumber = "9998877665",
                    Email = "cbe@gmail.com",
                    Capacity = 400,
                    ManagedBy = "Admin"
                }
            );

            // --- Blood Stocks ---
            modelBuilder.Entity<BloodStock>().HasData(
                new BloodStock { Id = 1, BloodBankId = 1, BloodGroup = "A+", UnitsAvailable = 10, LastUpdated = new DateTime(2025, 10, 01) },
                new BloodStock { Id = 2, BloodBankId = 1, BloodGroup = "B+", UnitsAvailable = 8, LastUpdated = new DateTime(2025, 10, 01) },
                new BloodStock { Id = 3, BloodBankId = 2, BloodGroup = "O+", UnitsAvailable = 12, LastUpdated = new DateTime(2025, 10, 01) }
            );

            // --- Blood Requests ---
            modelBuilder.Entity<BloodRequest>().HasData(
                new BloodRequest { Id = 1, RecipientId = 1, BloodGroupNeeded = "A+", Quantity = 2, RequestDate = new DateTime(2025, 10, 15), Status = "Pending" },
                new BloodRequest { Id = 2, RecipientId = 2, BloodGroupNeeded = "B+", Quantity = 3, RequestDate = new DateTime(2025, 10, 16), Status = "Pending" }
            );

            // --- Donation Records ---
            modelBuilder.Entity<DonationRecord>().HasData(
                new DonationRecord { Id = 1, DonorId = 1, BloodBankId = 1, DonationDate = new DateTime(2025, 06, 10), Quantity = 2, Status = "Completed" },
                new DonationRecord { Id = 2, DonorId = 2, BloodBankId = 2, DonationDate = new DateTime(2025, 05, 20), Quantity = 1, Status = "Completed" }
            );

            // --- Appointments ---
            modelBuilder.Entity<Appointment>().HasData(
                new Appointment { Id = 1, DonorId = 1, BloodBankId = 1, AppointmentDate = new DateTime(2025, 11, 10), Status = "Scheduled", Remarks = "First-time donor" },
                new Appointment { Id = 2, DonorId = 2, BloodBankId = 2, AppointmentDate = new DateTime(2025, 11, 15), Status = "Scheduled", Remarks = "Follow-up donation" }
            );

            // --- Donor Request Links ---
            modelBuilder.Entity<DonorRequestLink>().HasData(
                new DonorRequestLink { Id = 1, DonorId = 1, RequestId = 1, LinkedAt = new DateTime(2025, 10, 17) },
                new DonorRequestLink { Id = 2, DonorId = 2, RequestId = 2, LinkedAt = new DateTime(2025, 10, 17) }
            );

            // --- Notification Logs ---
            modelBuilder.Entity<NotificationLog>().HasData(
                new NotificationLog { Id = 1, UserId = 4, Message = "Your blood request is being processed", IsRead = false, CreatedAt = new DateTime(2025, 10, 17) },
                new NotificationLog { Id = 2, UserId = 2, Message = "Your donation appointment is confirmed", IsRead = false, CreatedAt = new DateTime(2025, 10, 17) }
            );
        }
    }
}
