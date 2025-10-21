import Table from "../components/ui/table";

export default function DataPengumuman() {
    const columns = ["Judul", "Tanggal", "Isi", "Author"];
    const data = [
        { judul: "Pengumuman Penting", tanggal: "2024-01-15", isi: "Ini adalah isi pengumuman pertama", author: "Admin" },
        { judul: "Update Sistem", tanggal: "2024-01-14", isi: "Sistem akan diupdate pada hari ini", author: "IT Support" }
    ];

    return (
        <main className="p-10">
            <h1 className="text-2xl font-bold mb-6">Data Pengumuman</h1>
            <Table columns={columns} data={data} />
        </main>
    );
}   
