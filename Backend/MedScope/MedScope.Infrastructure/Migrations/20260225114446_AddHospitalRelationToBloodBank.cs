using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHospitalRelationToBloodBank : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "BloodBanks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BloodBanks_HospitalId",
                table: "BloodBanks",
                column: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_BloodBanks_Hospitals_HospitalId",
                table: "BloodBanks",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BloodBanks_Hospitals_HospitalId",
                table: "BloodBanks");

            migrationBuilder.DropIndex(
                name: "IX_BloodBanks_HospitalId",
                table: "BloodBanks");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "BloodBanks");
        }
    }
}
