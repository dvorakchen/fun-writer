<script lang="ts">
	import MarginNavTop from '@/lib/components/margin_nav_top.svelte';
	import { userMan } from '@/universal/user.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		await userMan.ensureLogin();
	});
</script>

<svelte:head>
	<title>帕鲁AI-个人中心</title>
</svelte:head>

<MarginNavTop />
<h1>个人中心</h1>

{@render children?.()}
