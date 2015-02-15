import QUnit from 'qunitjs';
import Morph from 'morph-range';

import { document, fragment, element, comment, domHelper } from 'support';

QUnit.module('Morph tests');

QUnit.test('can construct a Morph', function (assert) {
  var m = new Morph(domHelper());
  assert.ok(m, "this test is fine" );
});

/* TODO move to a integration test, get working with MorphList
QUnit.test('insertBeforeMorph adds a child morph and updates its parentMorph', function (assert) {
  var parentMorph = new Morph(domHelper());

  var insertion = comment();

  var frag = fragment(insertion);

  parentMorph.setContent(insertion);

  assert.equalHTML(frag, '<!---->', 'initial');

  var a = element('p', 'A');
  var b = element('p', 'B');
  var c = element('p', 'C');
  var d = element('p', 'D');

  var aMorph = new Morph(parentMorph.domHelper);
  var bMorph = new Morph(parentMorph.domHelper);
  var cMorph = new Morph(parentMorph.domHelper);
  var dMorph = new Morph(parentMorph.domHelper);

  aMorph.setContent(a);
  bMorph.setContent(b);
  cMorph.setContent(c);
  dMorph.setContent(d);

  // append when there is no list
  parentMorph.insertBeforeMorph(bMorph, null);

  assert.equalHTML(frag, '<p>B</p>', 'append B');
  assert.strictEqual(parentMorph.firstNode, b);
  assert.strictEqual(parentMorph.lastNode, b);
  assert.strictEqual(parentMorph.firstChildMorph, bMorph, 'firstChildMorph to equal B morph');
  assert.strictEqual(parentMorph.lastChildMorph, bMorph, 'lastChildMorph to equal B morph');

  // append when there is one item
  parentMorph.insertBeforeMorph(dMorph, null);

  assert.equalHTML(frag, '<p>B</p><p>D</p>', 'append D');
  assert.strictEqual(parentMorph.firstNode, b);
  assert.strictEqual(parentMorph.lastNode, d);
  assert.strictEqual(parentMorph.firstChildMorph, bMorph, 'firstChildMorph to be unchanged');
  assert.strictEqual(parentMorph.lastChildMorph, dMorph, 'lastChildMorph to change to D morph');

  // insert before lastChildMorph
  parentMorph.insertBeforeMorph(cMorph, dMorph);
  assert.equalHTML(frag, '<p>B</p><p>C</p><p>D</p>', 'insert C before D');

  assert.strictEqual(parentMorph.firstNode, b);
  assert.strictEqual(parentMorph.lastNode, d);
  assert.strictEqual(parentMorph.firstChildMorph, bMorph, 'firstChildMorph to be unchanged');
  assert.strictEqual(parentMorph.lastChildMorph, dMorph, 'lastChildMorph to be unchanged');

  // insert before firstChildMorph
  parentMorph.insertBeforeMorph(aMorph, bMorph);
  assert.equalHTML(frag, '<p>A</p><p>B</p><p>C</p><p>D</p>', 'insert A before B');
  assert.strictEqual(parentMorph.firstNode, a);
  assert.strictEqual(parentMorph.lastNode, d);
  assert.strictEqual(parentMorph.firstChildMorph, aMorph, 'firstChildMorph to change to A morph');
  assert.strictEqual(parentMorph.lastChildMorph, dMorph, 'lastChildMorph to be unchanged');
});

/* TODO move to a integration test, get working with MorphList
QUnit.test('insertContentBeforeMorph', function (assert) {
  var parentMorph = new Morph(domHelper());

  var insertion = comment();

  var frag = fragment(insertion);

  parentMorph.setContent(insertion);

  var bMorph = parentMorph.appendContent('B');
  var dMorph = parentMorph.insertContentBeforeMorph('D', null);
  var cMorph = parentMorph.insertContentBeforeMorph('C', dMorph);
  var aMorph = parentMorph.insertContentBeforeMorph('A', bMorph);


  assert.equalHTML(frag, 'ABCD', 'inserted content correctly');
  assert.equal(parentMorph.firstNode.nodeValue, 'A');
  assert.equal(parentMorph.lastNode.nodeValue, 'D');

  var a = element('p', 'A');
  var b = element('p', 'B');
  var c = element('p', 'C');
  var d = element('p', 'D');

  aMorph.setContent(a);

  assert.equalHTML(frag, '<p>A</p>BCD', 'changed list through returned A morph');
  assert.strictEqual(parentMorph.firstNode, a);
  assert.equal(parentMorph.lastNode.nodeValue, 'D');

  bMorph.setContent(b);

  assert.equalHTML(frag, '<p>A</p><p>B</p>CD', 'changed list through returned B morph');

  cMorph.setContent(c);

  assert.equalHTML(frag, '<p>A</p><p>B</p><p>C</p>D', 'changed list through returned C morph');

  dMorph.setContent(d);

  assert.equalHTML(frag, '<p>A</p><p>B</p><p>C</p><p>D</p>', 'changed list through returned D morph');

  assert.strictEqual(parentMorph.firstNode, a);
  assert.strictEqual(parentMorph.lastNode, d);
  assert.strictEqual(parentMorph.firstChildMorph, aMorph, 'firstChildMorph to change to A morph');
  assert.strictEqual(parentMorph.lastChildMorph, dMorph, 'lastChildMorph to change to D morph');

  cMorph.destroy();

  assert.equalHTML(frag, '<p>A</p><p>B</p><p>D</p>', 'C was destroyed');
  assert.strictEqual(parentMorph.firstChildMorph, aMorph, 'firstChildMorph unchanged');
  assert.strictEqual(parentMorph.lastChildMorph, dMorph, 'lastChildMorph unchanged');
  assert.strictEqual(dMorph.previousMorph, bMorph, 'D morph previousMorph is B');
  assert.strictEqual(bMorph.nextMorph, dMorph, 'B morph nextMorph is D');

  assert.strictEqual(cMorph.parentMorph, null);
  assert.strictEqual(cMorph.firstNode, null);
  assert.strictEqual(cMorph.lastNode, null);
  assert.strictEqual(c.parentNode, null);

  aMorph.destroy();

  assert.equalHTML(frag, '<p>B</p><p>D</p>', 'A was destroyed');
  assert.strictEqual(parentMorph.firstNode, b);
  assert.strictEqual(parentMorph.firstChildMorph, bMorph, 'firstChildMorph is B');

  assert.strictEqual(aMorph.parentMorph, null);
  assert.strictEqual(aMorph.firstNode, null);
  assert.strictEqual(aMorph.lastNode, null);
  assert.strictEqual(a.parentNode, null);

  dMorph.destroy();

  assert.equalHTML(frag, '<p>B</p>', 'D was destroyed');
  assert.strictEqual(parentMorph.lastNode, b);
  assert.strictEqual(parentMorph.lastChildMorph, bMorph, 'firstChildMorph is B');

  assert.strictEqual(dMorph.parentMorph, null);
  assert.strictEqual(dMorph.firstNode, null);
  assert.strictEqual(dMorph.lastNode, null);
  assert.strictEqual(d.parentNode, null);

  bMorph.destroy();

  assert.strictEqual(bMorph.parentMorph, null);
  assert.strictEqual(bMorph.firstNode, null);
  assert.strictEqual(bMorph.lastNode, null);
  assert.strictEqual(d.parentNode, null);

  assert.strictEqual(parentMorph.firstChildMorph, null, 'firstChildMorph is null');
  assert.strictEqual(parentMorph.lastChildMorph, null, 'lastChildMorph is null');

  // insert the fragment
  frag = fragment(frag);

  // ensure list still works
  parentMorph.insertContentBeforeMorph(a);

  assert.equalHTML(frag, '<p>A</p>', 'detected insertion after clear');
});
*/
QUnit.test('can setContent of a morph', function (assert) {
  var morph = new Morph(domHelper());

  var insertion = comment();

  morph.setContent(insertion);

  var frag = fragment(
    element('p', 'before ', insertion, ' after')
  );

  morph.setContent('Hello World');

  assert.equalHTML(frag, '<p>before Hello World after</p>', 'it updated');

  morph.clear();

  assert.equalHTML(frag, '<p>before <!----> after</p>', 'clear');

  frag = fragment(frag);

  morph.setContent('Another test...');

  assert.equalHTML(frag, '<p>before Another test... after</p>', 'works after appending to a fragment');

  var el = element('div', '\n', frag, '\n');

  morph.setContent('Again');

  assert.equalHTML(el, '<div>\n<p>before Again after</p>\n</div>', 'works after appending to an element');

  morph.setContent('');

  assert.equalHTML(el, '<div>\n<p>before  after</p>\n</div>', 'setting to empty');
});

QUnit.test("When destroying a morph, do not explode if a parentMorph does not exist", function(assert) {
  var dom = domHelper();
  var morph = new Morph(dom);
  morph.clear();

  var morphFrag = document.createDocumentFragment();
  morphFrag.appendChild(morph.firstNode);
  assert.strictEqual(morphFrag.firstChild, morph.firstNode);
  assert.strictEqual(morphFrag.lastChild, morph.lastNode);
  morph.destroy();
  assert.strictEqual(morphFrag.firstChild, null);
});

QUnit.test("When destroying a morph, do not explode if a parentNode does not exist", function(assert) {
  var dom = domHelper();
  var morph = new Morph(dom);
  morph.destroy();
  assert.ok(true, "The test did not crash");
});
