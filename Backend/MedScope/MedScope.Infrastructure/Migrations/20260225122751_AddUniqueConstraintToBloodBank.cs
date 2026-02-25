using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConstraintToBloodBank : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BloodType",
                table: "BloodBanks",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_BloodBanks_BloodType_HospitalId",
                table: "BloodBanks",
                columns: new[] { "BloodType", "HospitalId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BloodBanks_BloodType_HospitalId",
                table: "BloodBanks");

            migrationBuilder.AlterColumn<string>(
                name: "BloodType",
                table: "BloodBanks",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
