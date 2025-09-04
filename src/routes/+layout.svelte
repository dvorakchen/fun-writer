<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import Login from '@/lib/components/login.svelte';
	import { toastMan } from '@/universal/toast.svelte';
	import { userMan } from '@/universal/user.svelte';
	import Avatar from '@/lib/components/avatar.svelte';
	import { onMount } from 'svelte';
	import { getByCurrentQueryString } from '@/lib/utils';
	import logo from '$lib/assets/favicon.ico';

	let { children } = $props();

	// svelte-ignore non_reactive_update
	let loginBox: Login;

	onMount(async () => {
		const redirect = getByCurrentQueryString('redirect');
		if (redirect && !userMan.isLoggedIn) {
			loginBox?.openLoginBox();
		}
	});

	function onLogout() {
		userMan.logout();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>AI帕鲁-欢乐写手-一键生成抽象派创意网文 | 人工智能写作工具</title>
	<meta
		name="keywords"
		content="网络小说生成器,AI写作,抽象派文学,小说创作工具,人工智能写作,创意写作,网文生成,内容生成器"
	/>
	<meta
		name="description"
		content="免费在线AI网络小说生成器, 采用先进人工智能技术生成抽象派、后现代风格的创意网络小说。支持多种文学风格，一键生成万字长文, 是作家和内容创作者的得力助手。"
	/>
</svelte:head>

<div class="fixed z-20">
	<div class="toast-top toast-end toast top-16">
		{#each toastMan.list as toast (toast[0])}
			{#if toast[1].toastType === 'success'}
				<div class="alert alert-success">
					<span>{toast[1].msg}</span>
				</div>
			{:else if toast[1].toastType === 'warning'}
				<div class="alert alert-warning">
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
		<a class="btn text-xl btn-link" href="/">
			<span class="h-7 w-7 rounded overflow-clip">
				<img class="w-full" src={logo} alt="AI帕鲁 logo" />
			</span>
			AI帕鲁</a
		>
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
					<li>
						<a href="/personal" class="link">
							<i class="icon-[mdi--person]"></i>
							个人中心</a
						>
					</li>
					<li>
						<button class="link link-error" onclick={onLogout}>
							<i class="icon-[mdi--logout]"></i>
							退出登录</button
						>
					</li>
				</ul>
			</div>
		{:else}
			<Login bind:this={loginBox} />
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
