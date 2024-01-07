---
title: 'Styleguide'
---
# Styleguide

<p class="lead">This page demonstrates the visual styles of the various elements that determine the design of this site.
You are currently reading a lead paragraph which is used to introduce an article or page. It has a bit bigger font size and a visual accent at the bottom.</p>

#### Typography
I've set the body copy in <a href="https://fonts.google.com/specimen/Lora">Lora</a> at <code>18px</code>. The headings are set in <a href="https://fonts.google.com/specimen/Playfair">Playfair</a> and the code snippets in <a href="https://fonts.google.com/specimen/Source+Code+Pro">Source Code Pro</a> all through <a href="https://www.fonts.google.com">Google Fonts</a>. 

# Heading 1
## Heading 2
### Heading 3
#### Heading 4

#### Paragraph
Aute occaecat mollit ex eiusmod aute voluptate in Lorem et consectetur. Anim fugiat enim eu ullamco consequat qui officia. Lorem occaecat id sit do adipisicing dolore occaecat magna. Aliquip esse consectetur voluptate exercitation aute id ad duis in cupidatat dolor ex nisi nisi. Fugiat elit in occaecat occaecat commodo cupidatat consectetur ullamco enim et non occaecat reprehenderit. Ullamco aute cupidatat ipsum eu mollit labore.

#### Aside
<aside>
This page demonstrates the visual styles of the various elements that determine the design of this site.
</aside>

#### Aside (information)
<aside class="information">
This page demonstrates the visual styles of the various elements that determine the design of this site.
</aside>

#### 45 / 75 range...
The amount of characters on one line resulting in * comfortable ♥ readi * ng is considered to be between 45-75. The Ideal length being 66.
[^line-length-ref-a][^line-length-ref-b][^line-length-ref-c]
[^line-length-ref-a]: [Readability: the Optimal Line Length](http://baymard.com/blog/line-length-readability "Readability: the Optimal Line Length") - Baymard Institute.
[^line-length-ref-b]: [The Elements of Typographic Style Applied to the Web](http://webtypography.net/2.1.2 "Search for it") - Robert Bringhurst.
[^line-length-ref-c]: [Accessibility for Teams](https://accessibility.digital.gov/visual-design/typography/ "Can you easily read and comprehend textual information on the page?") - U.S. General Services Administration

I'm taking this into account while defining the <code>max-width</code> of the content section of the site.

#### The iI1l test
The iI1l test. Let's hope these letterforms differ so we don't mix up a 1 with a l or an i with a l, or a I with a l.


#### Horizontal ruler

-------------------------------

#### Ordered list

1. Lorem
2. Ipsum
    1. dolor
    2. sit
3. Amed

#### Unordered List

- Lorem
    + ipsum
    + dolor
- Sit
- Amed


#### Italics
The <code>i</code> tag is used for expressions in an different voice, mood, language or otherwise different from the normal prose. Examples are technological terms, phrases or words from another language.

<i>The quick brown fox jumps over the lazy dog.</i>

#### Emphasis
The <code>em</code> element is used to denote text with stressed emphasis, i.e., something you’d pronounce differently. Where italicizing is required for stylistic differentiation, the <code>i</code> element may be preferable. 

You simply <em>must</em> try the new 12 year old Aultmore whisky!

#### Strong importance
The <code>strong</code> element is used to denote text with strong importance. Where bolding is used for stylistic differentiation, the <code>b</code> element may be preferable.

Please <strong>don’t</strong> stick nails in the electrical outlet.


#### Links
[butterscotch squares doing things the right way](http://google.com "Search for it on google") 

#### Blockquote

> This is a blockquote.
> on multiple lines <cite>[butterscotch squares](http://google.com "Search for it on google") test</cite>

#### Strong
For bold text, use <strong>strong</strong>.

#### Italics
To italicize text, use <em>em</em>.

#### Abbr
Abbreviations, like <abbr title="HyperText Markup Language">HTML</abbr> should use <abbr>abbr</abbr>, with an optional title attribute for the full phrase.

#### Citations
Citations, like — Jane Doe, should use <cite>cite</cite>.

#### Deleted & Inserted
Deleted text should use <del>del</del> and inserted text should use <ins>ins</ins>.

#### Super- and Subscript
Superscript text uses <sup>sup</sup> and subscript text uses <sub>sub</sub>.

#### Keys
Ah and <kbd>⌘</kbd> + <kbd>shift</kbd> keys are important.

Excepteur aliqua <abbr>sit</abbr> laborum <sup>et</sup> minim. Consectetur eiusmod veniam nostrud labore minim fugiat adipisicing et qui duis sunt consequat laboris. Deserunt incididunt <sub>et</sub> lets see how <kbd>⌘</kbd> and <kbd>shift</kbd> and <kbd>F4</kbd> look in a paragraph also <kbd>CAPS LOCK</kbd> reprehenderit <del>incididunt</del> <ins>veniam</ins> fugiat non aliqua anim anim officia. Lorem ut do nisi mollit <strong>reprehenderit</strong> <em>reprehenderit</em> officia cupidatat. Anim veniam sit consectetur dolore incididunt labore minim deserunt quis.

#### Code highlighting
```js
function showError(error) {
  if(error.code==0) {
    alert('An unknown error occurred.');
  } else if(error.code==1) {
    alert('No permission to locate your position.');
  } else if(error.code==2) {
    alert('The location could not be retrieved.');
  } else {
    alert('There was a timeout.');
  }
}
```

```css
.ninja {
    visibility: hidden;
    animation-duration: 0.000001s;
}
```
