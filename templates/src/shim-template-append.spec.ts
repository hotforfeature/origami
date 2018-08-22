import {
  resetShimHTMLTemplateAppend,
  shimHTMLTemplateAppend
} from './shim-template-append';

describe('templates', () => {
  describe('shimHTMLTemplateAppend()', () => {
    let NativeHTMLTemplateElement: typeof HTMLTemplateElement;

    let TestHTMLTemplateElementNoContent: {
      new (): {
        childNodes: Node[];
        appendChild(node: Node): Node;
      };
    };

    let TestHTMLTemplateElementContent: {
      new (): {
        childNodes: Node[];
        content: DocumentFragment;
        appendChild(node: Node): Node;
      };
    };

    function testTemplateContent() {
      const template = new HTMLTemplateElement();
      const node = document.createElement('div');
      template.appendChild(node);
      expect(template.childNodes.length).toBe(0);
      expect(template.content.childNodes.length).toBe(1);
      expect(template.content.childNodes[0]).toBe(node);
    }

    beforeAll(() => {
      NativeHTMLTemplateElement = window.HTMLTemplateElement;
    });

    beforeEach(() => {
      resetShimHTMLTemplateAppend();
      TestHTMLTemplateElementNoContent = class {
        childNodes: Node[] = [];
        appendChild(node: Node): Node {
          this.childNodes.push(node);
          return node;
        }
      };

      TestHTMLTemplateElementContent = class {
        childNodes: Node[] = [];
        content = document.createDocumentFragment();
        appendChild(node: Node): Node {
          this.childNodes.push(node);
          return node;
        }
      };
    });

    afterAll(() => {
      window.HTMLTemplateElement = NativeHTMLTemplateElement;
    });

    it('should patch appendChild and add nodes to content', async () => {
      window.HTMLTemplateElement = <any>TestHTMLTemplateElementContent;
      await shimHTMLTemplateAppend();
      testTemplateContent();
    });

    it('should add child normally if template does not have content', async () => {
      window.HTMLTemplateElement = <any>TestHTMLTemplateElementNoContent;
      await shimHTMLTemplateAppend();
      const template = new HTMLTemplateElement();
      const node = document.createElement('div');
      template.appendChild(node);
      expect(template.content).toBeUndefined();
      expect(template.childNodes.length).toBe(1);
      expect(template.childNodes[0]).toBe(node);
    });

    it('should handle multiple calls to resolve', async () => {
      window.HTMLTemplateElement = <any>TestHTMLTemplateElementContent;
      await Promise.all([shimHTMLTemplateAppend(), shimHTMLTemplateAppend()]);

      testTemplateContent();
    });
  });
});
