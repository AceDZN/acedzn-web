Upgrade guide
=============

We strive to reduce the number of breaking API changes but it is occasionally necessary.

The easiest way to upgrade is to start with the version you're currently using, then follow the guide to upgrade to the next version, and so on until you're at the latest version.

Changes between major versions are usually small so this is usually a quick process.

[11.0](https://motion.dev/docs/upgrade-guide#11-0)
--------------------------------------------------

Motion 11.11.12 is the version that merged Framer Motion and Motion One. With a far larger user base (20x), the conventions from the Framer Motion API took precedence.

Therefore, this will be the biggest set of breaking changes Motion One users should ever expect.

Note: Some APIs have been removed in `11.0`. If an API has been removed that you relied on, please let us know with [a feature request](https://github.com/motiondivision/motionone) and we can look at restoring it in a future update.

### [`animate`](https://motion.dev/docs/upgrade-guide#animate)

The biggest change to the API is the `animate` and `timeline` functions.

`animate` now comes in [two sizes](https://motion.dev/docs/animate), mini and hybrid.

The mini `animate` is broadly similar to the old `animate` function from Motion One. However, it's now smaller (just 2.5kb) and supports default value types:

import { animate } from "motion/mini"

animate(element, { width: 200 })

However, for `timeline`'s sequencing and animating independent transforms, the hybrid `animate` function must be used instead.

import { animate } from "motion"

animate(element, { x: 100 })

The hybrid `animate` is larger, currently 18kb, though this size will come down significantly in the short term.

#### [On removing independent transforms](https://motion.dev/docs/upgrade-guide#on-removing-independent-transforms)

Animating independent transforms is a popular feature in Motion One. However, when merging Motion One and Framer Motion, I wanted to bring the best of both libraries into one package.

Motion One had a strong emphasis on a tiny filesize, whereas Framer Motion concentrated on top animation performance.

By offering a hybrid `animate` with more capabilities, more room opened up to make the mini `animate` even smaller.

The way Motion One used to `animate` independent transforms was via CSS variables. CSS variables have a critical performance problem in that changing one always triggers paint.

Framer Motion's approach of building a `transform` string every frame significantly outperforms this. So it doesn't make sense to me to offer two technical approaches to the same problem when one outperforms the other.

Other changes are as follows:

#### [Callback function](https://motion.dev/docs/upgrade-guide#callback-function)

The callback function syntax of `animate()` has been replaced by the hybrid `animate()`'s ability to animate single values, motion values and objects.

You could directly replace it like so:

import { animate } from "motion"

animate(0, 1, { onUpdate: (progress) => {} })

#### [Options](https://motion.dev/docs/upgrade-guide#options)

-   `easing` is now `ease`.

-   `direction` is now `repeatType` with `loop`, `mirror` and `reverse` options.

-   `repeatDelay` has been added.

-   `endDelay` has been removed.

-   `allowWebkitAcceleration` has been removed.

#### [Spring/Glide](https://motion.dev/docs/upgrade-guide#spring-glide)

-   `glide` has been removed. Users of `glide` can instead use `type: "inertia"` via the hybrid `animate` function.

-   Spring animations are created by passing `spring` to the `type` option, with all other spring-related options going to the animation's options rather than the `spring` function:

import { animate } from "motion/mini"

import { spring } from "motion"

animate(

element,

{ transform: "translateX(100px)" },

{ type: spring, stiffness: 400 }

)

#### [Controls](https://motion.dev/docs/upgrade-guide#controls)

-   `currentTime` is now `time`.

-   `playbackRate` is now `speed`.

-   `finish()` is now `complete()`.

-   `playState` has been removed.

-   `finished` can be replaced by the animation controls themselves:

const animation = animate()

animation.then(() => {})

await animation

### [`inView`](https://motion.dev/docs/upgrade-guide#inview)

-   `amount`: The `"any"` option is now `"some"`.

### [`stagger`](https://motion.dev/docs/upgrade-guide#stagger)

-   `start` is now `startDelay`.

### [`scroll`](https://motion.dev/docs/upgrade-guide#scroll)

The `scroll` function has been given a huge performance boost. Now, animations will run via the browser's native `ScrollTimeline` where possible, or via Motion's new render-batched animation loop when not possible.

As a result, the bundlesize has doubled from 2.6kb to 5.2kb.

Additionally, `scroll` callbacks can now accept two arguments, `progress` and (moving to the second argument) `info`.

// Previously

scroll((info) => {}, options)

// Now

scroll((progress, info) => {}, options)

This allows callbacks that only need to use `progress` to run via `ScrollTimeline`, cutting scroll measurements.

### [Motion DevTools](https://motion.dev/docs/upgrade-guide#motion-devtools)

Motion DevTools is currently incompatible with Motion. If you're a Motion DevTools user, please stay on `motion@10` for now.