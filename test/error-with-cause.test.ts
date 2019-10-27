import Err from "../src/error/with-cause";

const CAUSAL_SPLIT_TEST = /\s*\n\s*\nCAUSED\sBY\:\n\n/g;

QUnit.module("custom error classes", () => {
  QUnit.test("error class name is part of the message", async assert => {
    assert.throws(() => {
      throw new Err("foo");
    }, /^Err\: foo$/);
  });
  QUnit.test("custom error subclasses are named properly", async assert => {
    class MyError extends Err {}
    assert.throws(() => {
      throw new MyError("foo");
    }, /^MyError\: foo$/);
  });
  QUnit.test(
    "without providing a cause, an error's stack looks similar to a 'vanilla error'",
    async assert => {
      try {
        throw new Err("foo");
        assert.ok(false, "should never reach this line");
      } catch (e) {
        const [firstStackLine, ...otherStackLinkes] = e.stack.split(
          "\n"
        ) as string[];

        assert.equal(firstStackLine, "Err: foo");
        assert.deepEqual(
          otherStackLinkes.map(sl => sl.trim().substr(0, 2)),
          new Array(otherStackLinkes.length).fill("at"),
          "every line after the first begins with 'at'"
        );
      }
    }
  );
  QUnit.module("Causal change", hooks => {
    let stack!: string;
    class FirstError extends Err {}
    class SecondError extends Err {}

    QUnit.test(
      "Clear separation between parts of the causal change",
      async assert => {
        try {
          try {
            throw new FirstError("this was thrown first");
            assert.ok(false, "should never reach this line");
          } catch (e) {
            throw new SecondError("this was thrown second", e);
            assert.ok(false, "should never reach this line");
          }

          assert.ok(false, "should never reach this line");
        } catch (e) {
          assert.ok(e.stack.length > 10);
          assert.ok(
            CAUSAL_SPLIT_TEST.test(e.stack),
            '"CAUSED BY:" is found in the stack'
          );
        }
      }
    );
    QUnit.test("If cause is an 'Error', its stack is shown", async assert => {
      try {
        try {
          throw new FirstError("this was thrown first");
          assert.ok(false, "should never reach this line");
        } catch (e) {
          throw new SecondError("this was thrown second", e);
          assert.ok(false, "should never reach this line");
        }
        assert.ok(false, "should never reach this line");
      } catch (e) {
        const [
          [firstLine1, ...restLines1],
          [firstLine2, ...restLines2]
        ] = (e as Error).stack.split(CAUSAL_SPLIT_TEST).map(s => s.split("\n"));
        assert.equal(firstLine1, "SecondError: this was thrown second");
        assert.equal(firstLine2, "  FirstError: this was thrown first");

        assert.deepEqual(
          restLines1.map(sl => sl.trim().substr(0, 2)),
          new Array(restLines1.length).fill("at"),
          "every line after the first begins with 'at'"
        );
        assert.deepEqual(
          restLines2.map(sl => sl.trim().substr(0, 2)),
          new Array(restLines2.length).fill("at"),
          "every line after the first begins with 'at'"
        );
      }
    });
  });
});
