using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MedScope.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RestoreAuditFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
    name: "CreatedAt",
    table: "Patients",
    type: "datetime2",
    nullable: false,
    defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedAt",
                table: "Patients",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastModifiedBy",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "LastModifiedAt",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "Patients");
        }
    }
}
