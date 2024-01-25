import { type ChartData } from "chart.js";
import { type FC } from "react";
import { Radar } from "react-chartjs-2";
import { type CpaxTableType } from "./CpaxModal";

type RadarChartProps = {
	cpax: CpaxTableType;
};

const RadarChart: FC<RadarChartProps> = ({ cpax }: RadarChartProps) => {
	const levelsColors = {
		0: "rgb(231, 111, 111)",
		1: "rgb(220, 132, 228)",
		2: "rgb(63, 164, 211)",
		3: "rgb(76, 206, 238)",
		4: "rgb(124, 216, 124)",
		5: "rgb(235, 235, 146)",
	};

	const chartData: ChartData<"radar", number[], unknown> = {
		labels: Object.keys(cpax),
		datasets: Object.values(cpax).map((val) => {
			const aopItem = val.aop;

			const dataValue = aopItem.level;

			return {
				label: aopItem.aspectName,
				backgroundColor: Object.values(levelsColors),
				borderColor: "red",
				pointBackgroundColor: "red",
				pointBorderColor: "#fff",
				pointHoverBackgroundColor: "#fff",
				pointHoverBorderColor: "red",
				data: [dataValue],
			};
		}),
	};

	return <Radar data={chartData} />;
};

export default RadarChart;
