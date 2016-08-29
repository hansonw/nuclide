---
pageid: feature-format-js
title: Format JS
layout: docs
permalink: /docs/features/format-js/
---

> This feature is currently experimental. For example, this currently does not handle using relative
> paths for the automatic `import`s and `require`s.

Format-js is a plugin with a goal of getting rid of all nits you might run across while writing
[Flow](/nuclide/docs/languages/flow) or [JavaScript](/nuclide/docs/langauges/other/#javascript) code.

Currently, it is focused on automatically adding/removing/sorting/formatting/etc your `require` and
`import` statements.

## Auto-Require

Adding `require` and `import` statements automatically allows you to focus on writing code without
worrying about that overhead. For example, if you try to use a variable that has not been declared
elsewhere, we will try to add it as a `require` or `import`.

> This just assume the `require` or `import` added is a valid module. Of course, it might not be.
> However, something like the [flow typechecker](/nuclide/docs/languages/flow) should tell you when you are
> using `require` on an entity that is not a module.

Take the following code example:

![](/nuclide/static/images/docs/feature-format-js-before.png)

If you press `cmd-shift-i` (`ctrl-shift-i` on Linux), your code will be analyzed for types that
you are using in your code that may need `import`ing or `require`d. The possible `import`s or
`require`s for your code are then added.

![](/nuclide/static/images/docs/feature-format-js-after.png)

You can then check if these are correct and modify accordingly. For example, maybe instead of
`const`, you want `var`.

## Settings

There are customizable settings for this Format-js in the Nuclide settings pane.

![](/nuclide/static/images/docs/feature-format-js-settings.png)
