import sys
import os
import subprocess
from PyQt5.QtCore import QUrl
from PyQt5.QtWidgets import QApplication, QWidget, QVBoxLayout
from PyQt5.QtWebEngineWidgets import QWebEngineView

class ModelViewer(QWidget):
    def __init__(self):
        super().__init__()

        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()

        self.browser = QWebEngineView()

        server_path = self.find_server_file()
        if server_path:
            subprocess.Popen(["python", server_path], shell=True)

            
            current_dir = os.path.dirname(os.path.abspath(__file__))

            
            index_html_path = os.path.join(current_dir, "templates", "index.html")

            self.browser.setUrl(QUrl.fromLocalFile(index_html_path))

        layout.addWidget(self.browser)
        self.setLayout(layout)

    def find_server_file(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        for root, dirs, files in os.walk(current_dir):
            if "server.py" in files:
                return os.path.join(root, "server.py")

def main():
    app = QApplication(sys.argv)
    viewer = ModelViewer()

    viewer.setWindowTitle("Model Viewer Test")

    viewer.show()
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()