using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHospitalIdToBeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Beds",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Beds");
        }
    }
}
