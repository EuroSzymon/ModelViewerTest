import sys
import os
import subprocess
import time
from PyQt6.QtCore import QUrl, Qt
from PyQt6.QtWidgets import QApplication, QWidget, QVBoxLayout, QMessageBox, QDialog, QLabel, QProgressBar, QMenu
from PyQt6.QtWebEngineWidgets import QWebEngineView
from PyQt6.QtGui import QIcon

class LoadingDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Loading...")
        self.setFixedSize(300, 100)
        self.setModal(True)
        layout = QVBoxLayout()

        self.label = QLabel("Loading, please wait...")
        layout.addWidget(self.label)

        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 0)
        layout.addWidget(self.progress_bar)

        self.setLayout(layout)

class CustomWebEngineView(QWebEngineView):
    def __init__(self, parent=None):
        super().__init__(parent)

    def contextMenuEvent(self, event):
        menu = QMenu(self)
        menu.addAction("Reload", self.reload)
        menu.exec(event.globalPos())

class ModelViewer(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Model Viewer Test")
        
        icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "viewer!.ico")
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))
        else:
            print("Icon file not found.")

        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        self.browser = CustomWebEngineView()
        self.resize(1500, 800)
        self.loading_dialog = LoadingDialog()
        self.loading_dialog.show()

        server_path = self.find_server_file()
        if server_path:
            print(f"Starting server: {server_path}")
            subprocess.Popen(["python", server_path], shell=True)
            time.sleep(1)
            self.browser.setUrl(QUrl("http://localhost:5000/"))
        else:
            QMessageBox.critical(self, "File Error", "Server file not found.")

        layout.addWidget(self.browser)
        self.setLayout(layout)
        
        self.browser.loadFinished.connect(self.on_load_finished)

    def find_server_file(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        for root, dirs, files in os.walk(current_dir):
            if "server.py" in files:
                return os.path.join(root, "server.py")
        return None

    def on_load_finished(self, success):
        self.loading_dialog.close()

def main():
    app = QApplication(sys.argv)
    viewer = ModelViewer()
    viewer.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
