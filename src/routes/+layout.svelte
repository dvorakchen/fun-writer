<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import Login from '@/lib/components/login.svelte';
	import { toastMan } from '@/universal/toast.svelte';
	import { userMan } from '@/universal/user.svelte';
	import Avatar from '@/lib/components/avatar.svelte';

	let { children } = $props();

	function onLogout() {
		userMan.logout();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>欢乐写手 - 一键生成抽象派创意网文 | 人工智能写作工具</title>
</svelte:head>

<div class="fixed top-12 right-4 z-20">
	<div class="toast-top toast-end toast">
		{#each toastMan.list as toast (toast[0])}
			{#if toast[1].toastType === 'success'}
				<div class="alert alert-success">
					<span>{toast[1].msg}</span>
				</div>
			{:else}
				<div class="alert alert-info">
					<span>{toast[1].msg}</span>
				</div>
			{/if}
		{/each}
	</div>
</div>

<div class="fixed top-0 z-10 navbar bg-transparent">
	<div class="flex-1">
		<!-- <a class="btn btn-ghost text-xl" href="/">欢乐写手</a> -->
	</div>
	<div class="min-w-24 flex-none pr-4 text-right">
		{#if userMan.isLoggedIn}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="m-1 cursor-pointer">
					<Avatar placeholder={userMan.username.slice(-4)} />
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul
					tabindex="0"
					class="dropdown-content menu z-1 mt-2 w-52 rounded-box bg-base-100 p-2 shadow-sm"
				>
					<!-- <li><a href="/">Item 1</a></li> -->
					<li>
						<button class="link link-error" onclick={onLogout}>
							<i class="icon-[mdi--logout]"></i>
							退出登录</button
						>
					</li>
				</ul>
			</div>
		{:else}
			<Login />
		{/if}
	</div>
</div>

{@render children?.()}

<footer class="mt-24 footer items-center bg-neutral p-4 text-neutral-content sm:footer-horizontal">
	<aside class="grid-flow-col items-center">
		<i class="icon-[mdi--license]"></i>
		<p>Copyright © {new Date().getFullYear()} - All right reserved</p>
	</aside>
</footer>
