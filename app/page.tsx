'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Play,
  Save,
  Download,
  Upload,
  FolderTree,
  Code,
  Smartphone,
  Settings,
  FileCode,
  Menu,
  X
} from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface FileNode {
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
}

const defaultProject: FileNode[] = [
  {
    name: 'app',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'main',
            type: 'folder',
            children: [
              {
                name: 'java',
                type: 'folder',
                children: [
                  {
                    name: 'com',
                    type: 'folder',
                    children: [
                      {
                        name: 'example',
                        type: 'folder',
                        children: [
                          {
                            name: 'myapp',
                            type: 'folder',
                            children: [
                              {
                                name: 'MainActivity.java',
                                type: 'file',
                                content: `package com.example.myapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private TextView textView;
    private Button button;
    private int clickCount = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = findViewById(R.id.textView);
        button = findViewById(R.id.button);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                clickCount++;
                textView.setText("Button clicked " + clickCount + " times!");
            }
        });
    }
}`
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: 'res',
                type: 'folder',
                children: [
                  {
                    name: 'layout',
                    type: 'folder',
                    children: [
                      {
                        name: 'activity_main.xml',
                        type: 'file',
                        content: `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome to Android Studio Cloud!"
        android:textSize="20sp"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="100dp" />

    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Click Me"
        android:layout_below="@id/textView"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="30dp" />

</RelativeLayout>`
                      }
                    ]
                  },
                  {
                    name: 'values',
                    type: 'folder',
                    children: [
                      {
                        name: 'strings.xml',
                        type: 'file',
                        content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">My App</string>
</resources>`
                      }
                    ]
                  }
                ]
              },
              {
                name: 'AndroidManifest.xml',
                type: 'file',
                content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
              }
            ]
          }
        ]
      },
      {
        name: 'build.gradle',
        type: 'file',
        content: `plugins {
    id 'com.android.application'
}

android {
    compileSdk 34

    defaultConfig {
        applicationId "com.example.myapp"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}`
      }
    ]
  }
]

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentFile, setCurrentFile] = useState<FileNode | null>(defaultProject[0].children![0].children![0].children![0].children![0].children![0].children![0].children![0])
  const [code, setCode] = useState(currentFile?.content || '')
  const [consoleOutput, setConsoleOutput] = useState('Android Studio Cloud IDE Ready\n> ')

  const findFile = (nodes: FileNode[], path: string[]): FileNode | null => {
    if (path.length === 0) return null
    const node = nodes.find(n => n.name === path[0])
    if (!node) return null
    if (path.length === 1) return node
    if (node.type === 'folder' && node.children) {
      return findFile(node.children, path.slice(1))
    }
    return null
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node, idx) => (
      <div key={idx}>
        <div
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-700 ${
            currentFile?.name === node.name ? 'bg-gray-700' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'file') {
              setCurrentFile(node)
              setCode(node.content || '')
            }
          }}
        >
          {node.type === 'folder' ? (
            <FolderTree size={16} className="text-yellow-500" />
          ) : (
            <FileCode size={16} className="text-blue-400" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && node.children && (
          <div>{renderFileTree(node.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  const runCode = () => {
    setConsoleOutput(prev =>
      prev + '\nBuilding APK...\nBuild successful!\nInstalling on emulator...\nApp launched successfully!\n> '
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <Code size={24} className="text-green-500" />
            <h1 className="text-xl font-bold">Android Studio Cloud</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            <Play size={16} />
            Run
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <Save size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <Download size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File Explorer */}
        {sidebarOpen && (
          <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-3 border-b border-gray-700 font-semibold text-sm">
              PROJECT EXPLORER
            </div>
            <div className="py-2">
              {renderFileTree(defaultProject)}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <div className="flex items-center bg-gray-800 border-b border-gray-700 px-2">
            {currentFile && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-r border-gray-700">
                <FileCode size={14} />
                <span className="text-sm">{currentFile.name}</span>
              </div>
            )}
          </div>

          {/* Split View - Editor and Preview */}
          <div className="flex flex-1 overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              <MonacoEditor
                height="100%"
                language={currentFile?.name.endsWith('.java') ? 'java' : 'xml'}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Device Preview */}
            <div className="w-80 bg-gray-850 border-l border-gray-700 flex flex-col">
              <div className="p-3 border-b border-gray-700 font-semibold text-sm flex items-center gap-2">
                <Smartphone size={16} />
                DEVICE PREVIEW
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl" style={{ width: '280px', height: '560px' }}>
                  <div className="bg-white h-full rounded-2xl flex flex-col items-center justify-center p-8 text-gray-900">
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-4">My App</h3>
                      <p className="text-lg mb-6">Welcome to Android Studio Cloud!</p>
                      <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Click Me
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Console/Terminal */}
          <div className="h-48 bg-gray-900 border-t border-gray-700 overflow-y-auto">
            <div className="p-3 border-b border-gray-700 font-semibold text-sm">
              CONSOLE
            </div>
            <pre className="p-4 text-sm font-mono text-green-400">
              {consoleOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
