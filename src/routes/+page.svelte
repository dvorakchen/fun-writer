<script lang="ts">
	import heroBg from '$lib/assets/hero-bg.png';
	import GenForGuest from '@/lib/components/gen_for_guest.svelte';
	import { userMan } from '@/universal/user.svelte';

	let trygen: HTMLElement;

	function onToTryGen() {
		trygen.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}
</script>

<main class="flex flex-col">
	<section class="relative hero h-[80vh] overflow-clip transform-3d">
		<div
			class="absolute inset-0 scale-350 -rotate-[35deg] rotate-x-45 rotate-y-45 bg-contain brightness-50 md:scale-250"
			style="background-image: url({heroBg});"
		></div>
		<div class="hero-overlay"></div>
		<div class="hero-content text-center text-neutral-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">欢乐写手</h1>
				<p>人工智能写作工具</p>
				<p class="mb-5">一键生成抽象派创意网文</p>
				<button class="btn btn-xl btn-primary" onclick={onToTryGen}>免费生成</button>
			</div>
		</div>
	</section>

	<section class="flex flex-col items-center gap-4 p-8 mb-32">
		<div class="h-24" bind:this={trygen}></div>

		{#if userMan.isLoggedIn}{:else}
			<GenForGuest />
		{/if}
	</section>
</main>
