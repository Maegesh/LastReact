using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BloodDonationSystem.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BloodBanks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ContactNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    ManagedBy = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodBanks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    ProfileImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BloodStocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BloodBankId = table.Column<int>(type: "int", nullable: false),
                    BloodGroup = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    UnitsAvailable = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodStocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BloodStocks_BloodBanks_BloodBankId",
                        column: x => x.BloodBankId,
                        principalTable: "BloodBanks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonorProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BloodGroup = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    LastDonationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EligibilityStatus = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonorProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonorProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NotificationLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecipientProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    HospitalName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PatientName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RequiredBloodGroup = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    ContactNumber = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipientProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipientProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonorId = table.Column<int>(type: "int", nullable: false),
                    BloodBankId = table.Column<int>(type: "int", nullable: false),
                    AppointmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Remarks = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_BloodBanks_BloodBankId",
                        column: x => x.BloodBankId,
                        principalTable: "BloodBanks",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Appointments_DonorProfiles_DonorId",
                        column: x => x.DonorId,
                        principalTable: "DonorProfiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DonationRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonorId = table.Column<int>(type: "int", nullable: false),
                    BloodBankId = table.Column<int>(type: "int", nullable: false),
                    DonationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonationRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonationRecords_BloodBanks_BloodBankId",
                        column: x => x.BloodBankId,
                        principalTable: "BloodBanks",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DonationRecords_DonorProfiles_DonorId",
                        column: x => x.DonorId,
                        principalTable: "DonorProfiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BloodRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecipientId = table.Column<int>(type: "int", nullable: false),
                    BloodGroupNeeded = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    RequestDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BloodRequests_RecipientProfiles_RecipientId",
                        column: x => x.RecipientId,
                        principalTable: "RecipientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonorRequestLinks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonorId = table.Column<int>(type: "int", nullable: false),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    LinkedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonorRequestLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonorRequestLinks_BloodRequests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "BloodRequests",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DonorRequestLinks_DonorProfiles_DonorId",
                        column: x => x.DonorId,
                        principalTable: "DonorProfiles",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "BloodBanks",
                columns: new[] { "Id", "Capacity", "ContactNumber", "Email", "Location", "ManagedBy", "Name" },
                values: new object[,]
                {
                    { 1, 500, "9876543210", "che@gmail.com", "Chennai", "Admin", "Chennai Central Blood Bank" },
                    { 2, 400, "9998877665", "cbe@gmail.com", "Coimbatore", "Admin", "Coimbatore Blood Bank" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "LastName", "PasswordHash", "Phone", "ProfileImageUrl", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@gmail.com", "System", "Admin", "admin123", null, null, 0, "admin" },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "arun@gmail.com", "Arun", "Kumar", "pass123", null, null, 1, "arun" },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "suresh@gmail.com", "Suresh", "Rajan", "pass123", null, null, 1, "suresh" },
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "priya@gmail.com", "Priya", "Devi", "pass456", null, null, 2, "priya" },
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "kavya@gmail.com", "Kavya", "Raj", "pass456", null, null, 2, "kavya" }
                });

            migrationBuilder.InsertData(
                table: "BloodStocks",
                columns: new[] { "Id", "BloodBankId", "BloodGroup", "LastUpdated", "UnitsAvailable" },
                values: new object[,]
                {
                    { 1, 1, "A+", new DateTime(2025, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 10 },
                    { 2, 1, "B+", new DateTime(2025, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 8 },
                    { 3, 2, "O+", new DateTime(2025, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 12 }
                });

            migrationBuilder.InsertData(
                table: "DonorProfiles",
                columns: new[] { "Id", "Age", "BloodGroup", "EligibilityStatus", "Gender", "LastDonationDate", "UserId" },
                values: new object[,]
                {
                    { 1, 28, "A+", true, "Male", new DateTime(2025, 6, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 2 },
                    { 2, 32, "B+", true, "Male", new DateTime(2025, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 3 }
                });

            migrationBuilder.InsertData(
                table: "NotificationLogs",
                columns: new[] { "Id", "CreatedAt", "IsRead", "Message", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 10, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Your blood request is being processed", 4 },
                    { 2, new DateTime(2025, 10, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "Your donation appointment is confirmed", 2 }
                });

            migrationBuilder.InsertData(
                table: "RecipientProfiles",
                columns: new[] { "Id", "ContactNumber", "HospitalName", "PatientName", "RequiredBloodGroup", "UserId" },
                values: new object[,]
                {
                    { 1, "9876543210", "Apollo Hospital", "Priya Devi", "A+", 4 },
                    { 2, "9998877665", "Global Hospital", "Kavya Raj", "B+", 5 }
                });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "AppointmentDate", "BloodBankId", "DonorId", "Remarks", "Status" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 11, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, 1, "First-time donor", "Scheduled" },
                    { 2, new DateTime(2025, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 2, "Follow-up donation", "Scheduled" }
                });

            migrationBuilder.InsertData(
                table: "BloodRequests",
                columns: new[] { "Id", "BloodGroupNeeded", "Quantity", "RecipientId", "RequestDate", "Status" },
                values: new object[,]
                {
                    { 1, "A+", 2, 1, new DateTime(2025, 10, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pending" },
                    { 2, "B+", 3, 2, new DateTime(2025, 10, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pending" }
                });

            migrationBuilder.InsertData(
                table: "DonationRecords",
                columns: new[] { "Id", "BloodBankId", "DonationDate", "DonorId", "Quantity", "Status" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2025, 6, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, 2, "Completed" },
                    { 2, 2, new DateTime(2025, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, 1, "Completed" }
                });

            migrationBuilder.InsertData(
                table: "DonorRequestLinks",
                columns: new[] { "Id", "DonorId", "LinkedAt", "RequestId" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2025, 10, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 2, 2, new DateTime(2025, 10, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_BloodBankId",
                table: "Appointments",
                column: "BloodBankId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DonorId",
                table: "Appointments",
                column: "DonorId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodRequests_RecipientId",
                table: "BloodRequests",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodStocks_BloodBankId",
                table: "BloodStocks",
                column: "BloodBankId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationRecords_BloodBankId",
                table: "DonationRecords",
                column: "BloodBankId");

            migrationBuilder.CreateIndex(
                name: "IX_DonationRecords_DonorId",
                table: "DonationRecords",
                column: "DonorId");

            migrationBuilder.CreateIndex(
                name: "IX_DonorProfiles_UserId",
                table: "DonorProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonorRequestLinks_DonorId",
                table: "DonorRequestLinks",
                column: "DonorId");

            migrationBuilder.CreateIndex(
                name: "IX_DonorRequestLinks_RequestId",
                table: "DonorRequestLinks",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationLogs_UserId",
                table: "NotificationLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipientProfiles_UserId",
                table: "RecipientProfiles",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "BloodStocks");

            migrationBuilder.DropTable(
                name: "DonationRecords");

            migrationBuilder.DropTable(
                name: "DonorRequestLinks");

            migrationBuilder.DropTable(
                name: "NotificationLogs");

            migrationBuilder.DropTable(
                name: "BloodBanks");

            migrationBuilder.DropTable(
                name: "BloodRequests");

            migrationBuilder.DropTable(
                name: "DonorProfiles");

            migrationBuilder.DropTable(
                name: "RecipientProfiles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
