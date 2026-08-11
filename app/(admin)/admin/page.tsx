import { FiBookOpen, FiGrid, FiMessageSquare, FiUsers } from "react-icons/fi";
import { fetchAdminStats } from "@/lib/api/recipe.api";
import { StatCard } from "@/components/admin/StatCard";
import { AdminStatsCharts } from "@/components/admin/AdminStatsCharts";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await fetchAdminStats();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={stats.totalUsers} icon={FiUsers} />
        <StatCard label="Recipes" value={stats.totalRecipes} icon={FiBookOpen} />
        <StatCard
          label="Reviews"
          value={stats.totalReviews}
          icon={FiMessageSquare}
        />
        <StatCard
          label="Categories"
          value={stats.totalCategories}
          icon={FiGrid}
        />
      </div>

      <AdminStatsCharts data={stats.recipesByCategory} />
    </div>
  );
}