<script lang="ts">
	import { MARK_END_CONNECTION, MARK_SSE_ID } from '@/net/sse';
	import Login from '@/lib/components/login.svelte';
	import { http } from '@/net/http';
	import { onMount } from 'svelte';
	import { guestPreGen } from '../client/cache';

	let generating = $state(false);
	let article = $state('');
	let desc = $state(
		'当废柴少年林辰意外唤醒上古冰凰血脉，必须在一个月内掌控这股力量并通过宗门试炼，否则将被逐出师门并遭血脉反噬而亡；与此同时，沉睡万载的极北寒渊正在苏醒，即将吞噬整个修真文明的远古冰劫已悄然逼近。'
	);
	let clipped = $state(false);
	let overcount = $state(false);

	let sseId = '';
	let eventSource: EventSource | null = null;

	onMount(() => {
		if (!article) {
			article = guestPreGen.retrieve();
		}
		overcount = guestPreGen.count >= guestPreGen.MAX_COUNT;
	});

	async function onGen() {
		if (guestPreGen.count >= guestPreGen.MAX_COUNT) {
			overcount = true;
			return;
		}

		guestPreGen.increaseCount();
		overcount = guestPreGen.count >= guestPreGen.MAX_COUNT;

		generating = true;
		article = '';

		eventSource = new EventSource(`/api/openai/guest?text=${desc}`);
		eventSource.onopen = () => {
			console.log('SSE connection opened.');
		};

		let preChar = '';
		eventSource.onmessage = (event) => {
			let data: string = event.data;
			if (data.startsWith(MARK_SSE_ID)) {
				sseId = data.split(':')[1];
				return;
			}
			if (preChar + data === '\\n' || data === '\\n') {
				data = '\n';
				article += data;
				preChar = '';
			} else if (data !== '\\' && data !== MARK_END_CONNECTION) {
				article += data;
			}

			preChar = data;
			if (data === MARK_END_CONNECTION) {
				console.log('close SSE');
				eventSource?.close();
				eventSource = null;
				generating = false;

				if (article) {
					guestPreGen.store(article);
				}
				return;
			}
		};
		eventSource.onerror = (ev) => {
			console.log(`SSE connection errored: `, ev);
			eventSource?.close();
			eventSource = null;
			generating = false;
		};
	}

	async function cancelGenerating() {
		eventSource?.close();
		eventSource = null;
		if (sseId !== null) {
			await http.post(`openai/stop-gen/${sseId}`);
		}
		console.log('SSE cancelled');
		generating = false;
	}
</script>

<h2 class="text-4xl font-bold">生成第一章</h2>
<h3 class="text-md">
	<!-- <button class="btn btn-sm btn-primary">登录</button> -->
	<Login class="btn btn-xs btn-primary" />
	后可生成连载作品
</h3>

<textarea
	class="textarea"
	placeholder="故事梗概，150 字，可不填，AI 帮你决定"
	rows="5"
	cols="30"
	maxlength="150"
	bind:value={desc}
></textarea>

<div class="flex items-center gap-4">
	{#if overcount}
		以达到游客使用上限，请
		<Login class="btn btn-xs btn-primary" />
	{:else}
		<button class="btn btn-primary" onclick={onGen} disabled={generating || overcount}>
			{#if generating}
				<span class="loading"></span>
			{/if}
			生成
		</button>
	{/if}

	{#if generating}
		<button class="btn btn-secondary" onclick={cancelGenerating}>取消生成</button>
	{/if}
	{#if article}
		<button
			class="btn btn-accent"
			onclick={() => {
				navigator.clipboard.writeText(article);
				clipped = true;
			}}
		>
			{#if clipped}
				✔
			{/if}
			复制</button
		>
	{/if}
</div>

<div class="mockup-code w-full max-w-7xl">
	<article class="px-4 text-lg whitespace-break-spaces md:px-6 md:leading-8">
		{@html article}
	</article>
</div>
<p>字数: {article.length}</p>
