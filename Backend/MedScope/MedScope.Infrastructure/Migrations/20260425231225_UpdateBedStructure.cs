using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBedStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BedNumber",
                table: "Beds");

            migrationBuilder.DropColumn(
                name: "IsOccupied",
                table: "Beds");

            migrationBuilder.RenameColumn(
                name: "Ward",
                table: "Beds",
                newName: "Name");

            migrationBuilder.AddColumn<int>(
                name: "AvailableBeds",
                table: "Beds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalBeds",
                table: "Beds",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvailableBeds",
                table: "Beds");

            migrationBuilder.DropColumn(
                name: "TotalBeds",
                table: "Beds");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Beds",
                newName: "Ward");

            migrationBuilder.AddColumn<string>(
                name: "BedNumber",
                table: "Beds",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsOccupied",
                table: "Beds",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
