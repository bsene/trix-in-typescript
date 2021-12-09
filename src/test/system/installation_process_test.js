import EditorController from "trix/controllers/editor_controller"

import { assert, defer, test, testGroup } from "test/test_helper"

testGroup("Installation process", { template: "editor_html" }, () => {
  test("element.editorController", () => {
    assert.ok(getEditorController() instanceof EditorController)
  })

  test("creates a contenteditable element", () => assert.ok(getEditorElement()))

  test("loads the initial document", () => {
    assert.equal(getEditorElement().textContent, "Hello world")
  })

  test("sets value property", (done) =>
    defer(() => {
      assert.equal(getEditorElement().value, "<div>Hello world</div>")
      done()
    }))
})

testGroup("Installation process without specified elements", { template: "editor_empty" }, () =>
  test("creates identified toolbar and input elements", (done) => {
    const editorElement = getEditorElement()

    const toolbarId = editorElement.getAttribute("toolbar")
    assert.ok(/trix-toolbar-\d+/.test(toolbarId), `toolbar id not assert.ok ${JSON.stringify(toolbarId)}`)
    const toolbarElement = document.getElementById(toolbarId)
    assert.ok(toolbarElement, "toolbar element not assert.ok")
    assert.equal(editorElement.toolbarElement, toolbarElement)

    const inputId = editorElement.getAttribute("input")
    assert.ok(/trix-input-\d+/.test(inputId), `input id not assert.ok ${JSON.stringify(inputId)}`)
    const inputElement = document.getElementById(inputId)
    assert.ok(inputElement, "input element not assert.ok")
    assert.equal(editorElement.inputElement, inputElement)

    done()
  })
)

testGroup("Installation process with specified elements", { template: "editor_with_toolbar_and_input" }, () => {
  test("uses specified elements", (done) => {
    const editorElement = getEditorElement()
    assert.equal(editorElement.toolbarElement, document.getElementById("my_toolbar"))
    assert.equal(editorElement.inputElement, document.getElementById("my_input"))
    assert.equal(editorElement.value, "<div>Hello world</div>")
    done()
  })

  test("can be cloned", (done) => {
    const originalElement = document.getElementById("my_editor")
    const clonedElement = originalElement.cloneNode(true)

    const { parentElement } = originalElement
    parentElement.removeChild(originalElement)
    parentElement.appendChild(clonedElement)

    defer(() => {
      const editorElement = getEditorElement()
      assert.equal(editorElement.toolbarElement, document.getElementById("my_toolbar"))
      assert.equal(editorElement.inputElement, document.getElementById("my_input"))
      assert.equal(editorElement.value, "<div>Hello world</div>")
      done()
    })
  })
})
