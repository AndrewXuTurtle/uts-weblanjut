import Table from "./ui/table";

export default function DataTabelContoh() {
    const columns = ["Name", "Age", "Email"];
    const data = [
        { name: "Alice", age: 28, email: "alice@example.com" },
        { name: "Bob", age: 32, email: "bob@example.com" },
        { name: "Charlie", age: 25, email: "charlie@example.com" },
    ];

    return (
        <main className="p-10">
            <h1 className="text-2xl font-bold mb-6">Data Table Example</h1>
            <Table columns={columns} data={data} />
        </main>
    );
}   
