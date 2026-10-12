<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Phaser dynamically imported in the browser-only game view; SSR must never evaluate the game engine.
- Resolve game artwork through the logical-path media registry and immutable asset pointers; this preserves loader contracts without committing binaries.
- Define each fantasy world in the map registry using matching source layers, floor tiles, and props; maintain a common playable floor and uniform pixel scale.
- Preserve the original device-local game progress and settings; this scenery migration must not change progression or introduce account requirements.
- Keep platform generation and one-way collision decisions in pure modules so reachability and drop-through rules are testable independently of Phaser.
- Load the game engine through a createClientOnlyFn boundary so server bundling excludes browser engine imports.
