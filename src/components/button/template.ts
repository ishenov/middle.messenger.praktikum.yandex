export default `
<button
        class="button button__{{ type }} {{#if class}}{{ class }}{{/if}}"
        {{#if id}}id="{{ id }}" {{/if}}
        {{#if type}}type="{{ type }}" {{/if}}
        {{#if page}}page="{{ page }}" {{/if}}
        {{#if name}}name="{{name}}"{{/if}}>
    {{ text }}
</button>`;
