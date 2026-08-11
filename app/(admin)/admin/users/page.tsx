import { fetchUsers } from "@/lib/api/user.api";
import { UsersTable } from "@/components/admin/UsersTable";
import { DataLoadFailed } from "@/components/ui/DataLoadFailed";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const result = await fetchUsers(page, 10);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted">
          {result.total} user{result.total === 1 ? "" : "s"}
        </p>
      </div>

      {result.users.length === 0 ? (
        <DataLoadFailed
          title="No users found"
          description="There are no users to manage yet."
        />
      ) : (
        <UsersTable
          users={result.users}
          total={result.total}
          page={result.page}
          limit={result.limit}
        />
      )}
    </div>
  );
}
