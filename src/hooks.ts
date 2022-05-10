import type { MaybePromise, RequestEvent, ResolveOptions } from '@sveltejs/kit/types/private';
import { minify } from 'html-minifier'; //Imports the module

const minification_options = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    decodeEntities: true,
    html5: true,
    ignoreCustomComments: [/^#/],
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    removeEmptyElements: true,
};

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({
    event,
    resolve,
}: {
    event: RequestEvent;
    resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response>;
}): Promise<Response> {
    const response = await resolve(event);

    if (response.headers.get('content-type') === 'text/html') {
        return new Response(minify(await response.text(), minification_options), response); //Minifies the response.body
    }

    return response; //Finally, we return back the response
}
