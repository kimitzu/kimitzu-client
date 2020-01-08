package com.kimitzu.dev;

import android.os.Bundle;
import android.os.Environment;
import android.util.Log;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import mobile.Node;
import mobile.NodeConfig;

import java.io.File;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
    }});
  }

  public void onStart() {
    super.onStart();
    startObServer(true);
  }

  public String createFolder(String name, boolean isTestnet) {
    String folderPath = Environment.getExternalStorageDirectory().toString() + "/" + name;
    if (isTestnet) {
      folderPath += "-testnet";
    }
    File folder = new File(folderPath);
    if (!folder.exists()) {
      folder.mkdir();
    }
    return folderPath;
  }

  private void startObServer(boolean isTestnet) {
    NodeConfig nodeConfig = new NodeConfig();
    String repoPath = createFolder("kimitzu", isTestnet);
    nodeConfig.setTestnet(isTestnet);
    nodeConfig.setRepoPath(repoPath);
    Node node = new Node(nodeConfig, "", "");
    try {
      node.start();
    } catch (Exception e) {
      Log.e("WTF?", e.toString());
    }
  }


}
