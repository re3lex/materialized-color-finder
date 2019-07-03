<template>
	<div class="container">
		<b-container class="bv-example-row">
			<b-row>
				<b-col
					sm="12"
					md="6"
					lg="4"
					v-for="color in colors"
					:key="color"
					class="dynamic-color"
				>
					<div
						v-for="hue in getAcceptableHues(color)"
						:key="hue"
						:class="`${color} ${hue}`"
						:style="hue.startsWith('darken') && 'color: rgba(255, 255, 255, 0.9);'"
					>
						{{ colorValues[color+'_'+hue] }} {{ color }} {{ hue }}
					</div>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			colors: [
				'red',
				'pink',
				'purple',
				'deep-purple',
				'indigo',
				'blue',
				'light-blue',
				'cyan',
				'teal',
				'green',
				'light-green',
				'lime',
				'yellow',
				'amber',
				'orange',
				'deep-orange',
				'brown',
				'blue-grey',
				'grey',
			],
			hues: [
				'base',
				'lighten-5',
				'lighten-4',
				'lighten-3',
				'lighten-2',
				'lighten-1',
				'darken-1',
				'darken-2',
				'darken-3',
				'darken-4',
				'accent-1',
				'accent-2',
				'accent-3',
				'accent-4',
			],
			colorValues: {},
		};
	},
	methods: {
		getAcceptableHues(color) {
			if (['brown', 'blue-grey', 'grey'].indexOf(color) < 0) {
				return this.hues;
			}
			return this.hues.filter(h => !h.startsWith('accent-'));
		},
		rgbToHex(color) {
			color = `${color}`;
			if (!color || color.indexOf('rgb') < 0) {
				return;
			}

			if (color.charAt(0) === '#') {
				return color;
			}

			const nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color);
			const r = parseInt(nums[2], 10).toString(16);
			const g = parseInt(nums[3], 10).toString(16);
			const b = parseInt(nums[4], 10).toString(16);

			return `#${
				(r.length === 1 ? `0${r}` : r)
        + (g.length === 1 ? `0${g}` : g)
        + (b.length === 1 ? `0${b}` : b)}`.toUpperCase();
		},
	},
	created() {
		const vals = {};
		this.colors.forEach((color) => {
			this.hues.forEach((hue) => {
				vals[`${color}_${hue}`] = 'na';
			});
		});
		this.colorValues = Object.assign({}, this.colorValues, vals);
	},

/*
	mounted() {
		this.$nextTick(() => {
			const vals = {};
			this.colors.forEach((color) => {
				this.hues.forEach((hue) => {
					const el = document.querySelector(`.${color}.${hue}`);
					const bgColor = window.getComputedStyle(el, null).getPropertyValue('background-color');

					vals[`${color}_${hue}`] = this.rgbToHex(bgColor);
				});
			});
			this.colorValues = Object.assign({}, this.colorValues, vals);
		 });
	}, */
};
</script>

<style lang="scss">
.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	.dynamic-color {
		margin-bottom: 55px;
		> div {
			height: 55px;
			width: 100%;
			padding: 0 15px;
			font-weight: 500;
			font-size: 12px;
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-pack: center;
			-webkit-justify-content: center;
			-ms-flex-pack: center;
			justify-content: center;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-webkit-flex-direction: column;
			-ms-flex-direction: column;
			flex-direction: column;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
		}
	}
}
</style>
