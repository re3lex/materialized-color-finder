<template>
	<b-container>
		<b-navbar
			type="dark"
			variant="dark"
			sticky
		>
			<b-navbar-brand href="#">
				Materialized Color palette
			</b-navbar-brand>
			<!-- Right aligned nav items -->
			<b-navbar-nav
				class="expanded-search"
			>
				<b-nav-form>
					<b-form-input
						size="sm"
						class="mr-lg-2 "
						placeholder="Search"
						v-model="filter"
					/>
				</b-nav-form>
			</b-navbar-nav>
		</b-navbar>
		<b-row class="palette">
			<b-col
				sm="12"
				md="6"
				lg="4"
				v-for="comb in allowedCombinations"
				:key="comb.color"
				class="dynamic-color"
			>
				<div
					v-for="hue in comb.hues"
					:key="hue"
					:class="`${comb.color} ${hue}`"
					:style="hue.startsWith('darken') && 'color: rgba(255, 255, 255, 0.9);'"
				>
					{{ colorValues[comb.color+'_'+hue] }} {{ comb.color }} {{ hue }}

					<b-link
						@click="doCopy(comb.color, hue)"
						v-b-tooltip.hover
						:title="`Copy value: color('${comb.color}','${hue}')`"
					>
						<i class="fas fa-copy"></i>
					</b-link>
				</div>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import styler from 'stylerjs';

export default {
	components: {},
	data() {
		return {
			filter: '',
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
			reverseColorValues: {},
		};
	},

	methods: {
		getAcceptableHues(color) {
			if (['brown', 'blue-grey', 'grey'].indexOf(color) < 0) {
				return this.filteredHues;
			}
			return this.filteredHues.filter(h => !h.startsWith('accent-'));
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

			return `#${(r.length === 1 ? `0${r}` : r)
				+ (g.length === 1 ? `0${g}` : g)
				+ (b.length === 1 ? `0${b}` : b)}`.toUpperCase();
		},

		doCopy(color, hue) {
			const v = `color('${color}','${hue}')`;
			if (this.$clipboard(v)) {
				this.$bvToast.toast('Color statement successfully copied!', {
					title: 'Copied!',
					variant: 'success',
					solid: true,
					toaster: 'b-toaster-bottom-center',
				});
			} else {
				this.$bvToast.toast('Unable to copy Color statement!', {
					title: 'Error!',
					variant: 'danger',
					solid: true,
					toaster: 'b-toaster-bottom-center',
				});
			}
		},
	},

	computed: {
		allowedCombinations() {
			if (!this.filter || !this.reverseColorValues) {
				const vals = [];
				this.colors.forEach((color) => {
					const o = { color, hues: [] };
					this.getAcceptableHues(color).forEach((hue) => {
						o.hues.push(hue);
					});
					vals.push(o);
				});
				return vals;
			}
			const filtered = {};

			const fixedFilter = this.filter.trim().toUpperCase();
			Object.keys(this.reverseColorValues).forEach((hex) => {
				const data = this.reverseColorValues[hex];
				if (hex.includes(fixedFilter)) {
					const v = filtered[data.color] || { color: data.color, hues: [] };
					v.hues.push(data.hue);
					filtered[data.color] = v;
				}
			});
			return Object.values(filtered);
		},
		filteredColors() {
			if (!this.filter || !this.reverseColorValues) {
				return this.colors;
			}
			const fixedFilter = this.filter.toUpperCase();
			const filtered = [];
			Object.keys(this.reverseColorValues).forEach((hex) => {
				const data = this.reverseColorValues[hex];
				if (filtered.indexOf(data.color) < 0 && hex.includes(fixedFilter)) {
					filtered.push(data.color);
				}
			});

			return filtered;
		},

		filteredHues() {
			if (!this.filter || !this.reverseColorValues) {
				return this.hues;
			}
			const fixedFilter = this.filter.toUpperCase();
			const filtered = [];
			Object.keys(this.reverseColorValues).forEach((hex) => {
				const data = this.reverseColorValues[hex];
				if (filtered.indexOf(data.hue) < 0 && hex.includes(fixedFilter)) {
					filtered.push(data.hue);
				}
			});

			return filtered;
		},
	},

	mounted() {
		this.$nextTick(() => {
			const vals = {};
			const revValues = {};
			this.colors.forEach((color) => {
				this.hues.forEach((hue) => {
					const rule = `.${color}.${hue}`;
					const rgbColor = styler(rule).get(['background-color']);
					if (rgbColor) {
						const hex = this.rgbToHex(rgbColor['background-color']);

						vals[`${color}_${hue}`] = hex;
						revValues[hex] = {
							color,
							hue,
						};
					}
				});
			});

			this.colorValues = Object.assign({}, this.colorValues, vals);
			this.reverseColorValues = Object.assign(
				{},
				this.reverseColorValues,
				revValues,
			);
		});
	},
};
</script>

<style lang="scss">
.container {
	margin: 0 auto;
	min-height: 100vh;
	//display: flex;
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

	.palette {
		margin-top: 20px;
	}

	.expanded-search {
		width: 100%;
		display: inline-block;
		input {
			width: 100%;
		}
	}
}
</style>
