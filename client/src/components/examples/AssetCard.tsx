import { AssetCard } from "../AssetCard";

export default function AssetCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AssetCard
        name="Primary Residence"
        value={425000}
        type="property"
        details="3 bed, 2 bath • Purchased 2019"
      />
      <AssetCard
        name="401(k) Retirement"
        value={89500}
        type="investment"
        growth={12.4}
        details="Employer match: 6% • Vanguard Target 2050"
      />
      <AssetCard
        name="2021 Honda Accord"
        value={22000}
        type="vehicle"
        details="38k miles • Fair condition"
      />
      <AssetCard
        name="Emergency Fund"
        value={15000}
        type="savings"
        details="High-yield savings account"
      />
      <AssetCard
        name="Brokerage Account"
        value={12800}
        type="investment"
        growth={8.2}
        details="Index funds & ETFs"
      />
    </div>
  );
}
