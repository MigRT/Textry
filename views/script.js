document.getElementById("save-clo").onclick = function onSave() {
        perImage.toBlob((blob) => {
          const timestamp = Date.now().toString();
          const a = document.createElement('a');
          document.body.append(a);
          a.download = `export-${timestamp}.png`;
          a.href = URL.createObjectURL(blob);
          a.click();
          a.remove();
        });
      }