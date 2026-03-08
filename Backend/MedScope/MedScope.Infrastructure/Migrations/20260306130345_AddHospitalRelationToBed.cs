using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHospitalRelationToBed : Migration
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

            migrationBuilder.CreateIndex(
                name: "IX_Beds_HospitalId",
                table: "Beds",
                column: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Beds_Hospitals_HospitalId",
                table: "Beds",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Beds_Hospitals_HospitalId",
                table: "Beds");

            migrationBuilder.DropIndex(
                name: "IX_Beds_HospitalId",
                table: "Beds");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Beds");
        }
    }
}
