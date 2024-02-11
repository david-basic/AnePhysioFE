import {
	Chart,
	ChartDataset,
	ChartOptions,
	Filler,
	Legend,
	LineElement,
	PointElement,
	RadarController,
	RadialLinearScale,
	Tooltip,
	type ChartData,
} from "chart.js";
import { type FC } from "react";
import { Radar } from "react-chartjs-2";
import { type CpaxDateTimeType, type CpaxTableType } from "./CpaxModal";
import dayjs from "dayjs";

type RadarChartProps = {
	cpax: CpaxTableType;
	dateTime: CpaxDateTimeType;
	secondCpaxDefined?: boolean;
	secondCpax?: CpaxTableType;
	secondCpaxDateTime?: CpaxDateTimeType;
};

Chart.register(
	RadarController,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Legend,
	Tooltip
);

const RadarChart: FC<RadarChartProps> = ({
	cpax,
	dateTime,
	secondCpaxDefined = false,
	secondCpax,
	secondCpaxDateTime,
}: RadarChartProps) => {
	const levelsColors: { [key: number]: string } = {
		0: "rgb(231, 111, 111)",
		1: "rgb(220, 132, 228)",
		2: "rgb(63, 164, 211)",
		3: "rgb(76, 206, 238)",
		4: "rgb(124, 216, 124)",
		5: "rgb(196, 190, 16)",
	};

	const firstData = Object.values(cpax).map((val) => val.aop.level);

	const firstDataSet: ChartDataset<"radar", number[]> = {
		label: `${dayjs(dateTime.date).format("DD.MM.YYYY")}`,
		data: firstData as number[],
		borderColor: "red",
		backgroundColor: "rgba(255, 0, 0, 0.03)",
		pointBackgroundColor: firstData.map((level) => levelsColors[level]),
		pointBorderColor: "rgba(255, 0, 0, 0.03)",
		pointHoverBackgroundColor: firstData.map((level) => levelsColors[level]),
		pointHoverBorderColor: "red",
		pointRadius: 6,
		hoverRadius: 8,
		fill: true,
	};

	let secondDataSet: ChartDataset<"radar", number[]> | undefined =
		undefined;

	if (secondCpaxDefined) {
		const secondData = Object.values(secondCpax!).map(
			(val) => val.aop.level
		);

		secondDataSet = {
			label: `${dayjs(secondCpaxDateTime!.date).format(
				"DD.MM.YYYY"
			)}`,
			data: secondData as number[],
			borderColor: "blue",
			backgroundColor: "rgba(0, 0, 255, 0.03)",
			pointBackgroundColor: secondData.map(
				(level) => levelsColors[level]
			),
			pointBorderColor: "rgba(0, 0, 255, 0.03)",
			pointHoverBackgroundColor: secondData.map(
				(level) => levelsColors[level]
			),
			pointHoverBorderColor: "blue",
			pointRadius: 6,
			hoverRadius: 8,
			fill: true,
		};
	}

	const chartOptions: ChartOptions<"radar"> = {
		elements: {
			line: {
				borderWidth: 1,
			},
		},
		scales: {
			r: {
				suggestedMax: 5,
				suggestedMin: 0,
				ticks: {
					stepSize: 1,
					font: {
						size: 16,
						weight: "bold",
					},
					color: (context) => {
						const value = context.tick.value;
						return levelsColors[value];
					},
					showLabelBackdrop: false,
				},
				grid: {
					color: (context) => {
						const value = context.tick.value;
						return levelsColors[value] || "rgba(0, 0, 0, 0.1)";
					},
				},
				angleLines: {
					color: "rgba(0, 0, 0, 0.1)",
					lineWidth: 2,
					display: true,
				},
			},
		},
		plugins: {
			legend: {
				display: true,
				position: "top",
				labels: {
					font: {
						size: 16,
					},
				},
			},
			tooltip: {
				callbacks: {
					title: () => "",
					label: (context) =>
						`Level ${context.formattedValue} - ${
							context.chart.data.labels![context.dataIndex]
						}`,
				},
			},
		},
	};

	const chartData: ChartData<"radar", number[], unknown> = {
		labels: Object.values(cpax).map((cp) => cp.aop.aspectName),
		datasets: secondCpaxDefined === true
			? [firstDataSet, secondDataSet!]
			: [firstDataSet],
	};

	return <Radar data={chartData} options={chartOptions} />;
};

export default RadarChart;
