<script lang="ts">
	import { goto } from '$app/navigation';
	import { userMan } from '@/universal/user.svelte';
</script>

<div class="flex h-full min-h-screen flex-col items-center justify-start gap-4">
	<div class="flex max-w-[90%] min-w-4xl flex-col items-start gap-4">
		<h1 class="text-4xl font-bold">个人中心</h1>

		<div
			class="flex w-full flex-col gap-8 rounded-xl bg-primary p-6 text-primary-content shadow-lg"
		>
			<span class="text-3xl"
				>{userMan.username}
				<button class="btn btn-sm btn-secondary" onclick={() => goto('/write-board')}
					>开始写作</button
				>
			</span>

			<div class="flex flex-row items-center gap-4">
				<span>余额: 1000￥</span><button class="btn btn-xs btn-accent">充值</button>
			</div>
		</div>
	</div>
</div>
